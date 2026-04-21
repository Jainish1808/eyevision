"""
Complete authentication routes with all security features.
Includes JWT, OAuth2, MFA, password reset, rate limiting, and audit logging.
"""
from datetime import datetime, timedelta
from typing import Annotated
from uuid import uuid4
import secrets

from fastapi import APIRouter, Depends, HTTPException, status, Request, Response, Cookie
from fastapi.responses import JSONResponse, RedirectResponse
from pymongo.database import Database
from slowapi import Limiter
from slowapi.util import get_remote_address
import redis.asyncio as redis

from app.core.mongodb import get_db
from app.core.redis_manager import get_redis_blacklist, get_redis_cache
from app.core.security import (
    create_access_token,
    create_refresh_token,
    decode_token,
    get_password_hash,
    verify_password,
    validate_password_strength,
    check_password_breach,
    blacklist_token,
    revoke_all_user_tokens,
    generate_password_reset_token,
)
from app.core.dependencies import get_current_user, get_optional_user
from app.core.audit import audit_logger
from app.core.mfa import (
    generate_totp_secret,
    generate_totp_uri,
    generate_qr_code,
    verify_totp_code,
    generate_backup_codes,
    verify_backup_code,
)
from app.core.oauth import oauth, oauth_manager
from app.core.rbac import Role
from app.schemas.auth import (
    UserLogin,
    UserRegister,
    RefreshTokenRequest,
    PasswordResetRequest,
    PasswordResetConfirm,
    PasswordChange,
    MFAEnableRequest,
    MFAVerifyRequest,
    MFADisableRequest,
    BackupCodeVerifyRequest,
    AuthResponse,
    TokenResponse,
    MFASetupResponse,
    MessageResponse,
    UserResponse,
)
from config import settings


router = APIRouter(prefix="/api/auth", tags=["Authentication"])
limiter = Limiter(key_func=get_remote_address)


def _public_user(doc: dict) -> UserResponse:
    """Convert MongoDB user document to public user response."""
    return UserResponse(
        id=doc["id"],
        email=doc["email"],
        username=doc.get("username", doc.get("name", "")),
        name=doc.get("name", ""),
        phone=doc.get("phone"),
        avatar=doc.get("avatar"),
        is_active=doc.get("is_active", True),
        is_verified=doc.get("is_verified", False),
        role=doc.get("role", "user"),
        mfa_enabled=doc.get("mfa_enabled", False),
        created_at=doc.get("created_at"),
    )


def _set_refresh_token_cookie(response: Response, refresh_token: str):
    """Set refresh token in HttpOnly secure cookie."""
    response.set_cookie(
        key="refresh_token",
        value=refresh_token,
        max_age=settings.JWT_REFRESH_TOKEN_EXPIRE_DAYS * 86400,
        httponly=True,  # Not accessible to JavaScript
        secure=settings.COOKIE_SECURE,  # HTTPS only in production
        samesite=settings.COOKIE_SAMESITE,
        domain=settings.COOKIE_DOMAIN or None,
        path="/api/auth",  # Narrow scope
    )


@router.post("/register", response_model=AuthResponse, status_code=status.HTTP_201_CREATED)
@limiter.limit(settings.RATE_LIMIT_REGISTER)
async def register(
    request: Request,
    response: Response,
    data: UserRegister,
    db: Database = Depends(get_db),
):
    """
    Register a new user with strict validation and password breach checking.
    Rate limited to prevent abuse.
    """
    # Check if email already exists
    if db.users.find_one({"email": data.email}):
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Email already registered"
        )
    
    # Check if username already taken
    if db.users.find_one({"username": data.username}):
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Username already taken"
        )
    
    # Validate password strength
    is_valid, error_msg = validate_password_strength(data.password)
    if not is_valid:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=error_msg
        )
    
    # Check if password has been breached
    if await check_password_breach(data.password):
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="This password has been found in a data breach. Please choose a different password."
        )
    
    # Create user
    now = datetime.utcnow()
    user = {
        "id": str(uuid4()),
        "email": data.email,
        "username": data.username,
        "name": data.username,
        "phone": data.phone,
        "avatar": None,
        "hashed_password": get_password_hash(data.password),
        "is_active": True,
        "is_verified": False,
        "role": Role.USER.value,
        "mfa_enabled": False,
        "mfa_secret": None,
        "backup_codes": [],
        "created_at": now,
        "updated_at": now,
    }
    db.users.insert_one(user)
    
    # Create empty cart for user
    db.carts.update_one(
        {"user_id": user["id"]},
        {
            "$setOnInsert": {
                "user_id": user["id"],
                "items": [],
                "created_at": now,
            },
            "$set": {"updated_at": now},
        },
        upsert=True,
    )
    
    # Generate tokens
    token_data = {"sub": user["id"], "email": user["email"], "role": user["role"]}
    access_token = create_access_token(token_data)
    refresh_token = create_refresh_token(token_data)
    
    # Set refresh token in HttpOnly cookie
    _set_refresh_token_cookie(response, refresh_token)
    
    # Audit log
    audit_logger.log_login_success(user["id"], request)
    
    return AuthResponse(
        user=_public_user(user),
        access_token=access_token,
        refresh_token=None,  # In cookie, not exposed
        expires_in=settings.JWT_ACCESS_TOKEN_EXPIRE_MINUTES * 60
    )


@router.post("/login", response_model=AuthResponse)
@limiter.limit(settings.RATE_LIMIT_LOGIN)
async def login(
    request: Request,
    response: Response,
    data: UserLogin,
    db: Database = Depends(get_db),
):
    """
    Login with email and password.
    Rate limited to prevent brute force attacks.
    Returns generic error messages to prevent user enumeration.
    """
    user = db.users.find_one({"email": data.email})
    
    # Generic error message - never reveal if email exists
    invalid_credentials = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Invalid email or password"
    )
    
    if not user or not user.get("hashed_password"):
        audit_logger.log_login_failure(data.email, request, "user_not_found")
        raise invalid_credentials
    
    if not verify_password(data.password, user["hashed_password"]):
        audit_logger.log_login_failure(data.email, request, "invalid_password")
        raise invalid_credentials
    
    if not user.get("is_active", True):
        audit_logger.log_login_failure(data.email, request, "account_disabled")
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Account is disabled"
        )
    
    # If MFA is enabled, return partial token requiring MFA verification
    if user.get("mfa_enabled", False):
        # Create a temporary token that requires MFA verification
        temp_token = create_access_token(
            {"sub": user["id"], "email": user["email"], "mfa_pending": True},
            expires_delta=timedelta(minutes=5)
        )
        return JSONResponse(
            status_code=status.HTTP_200_OK,
            content={
                "mfa_required": True,
                "temp_token": temp_token,
                "message": "MFA verification required"
            }
        )
    
    # Generate tokens
    token_data = {"sub": user["id"], "email": user["email"], "role": user.get("role", "user")}
    access_token = create_access_token(token_data)
    refresh_token = create_refresh_token(token_data)
    
    # Set refresh token in HttpOnly cookie
    _set_refresh_token_cookie(response, refresh_token)
    
    # Audit log
    audit_logger.log_login_success(user["id"], request)
    
    return AuthResponse(
        user=_public_user(user),
        access_token=access_token,
        refresh_token=None,
        expires_in=settings.JWT_ACCESS_TOKEN_EXPIRE_MINUTES * 60
    )


@router.post("/refresh", response_model=TokenResponse)
async def refresh_token(
    request: Request,
    response: Response,
    refresh_token_cookie: Annotated[str | None, Cookie(alias="refresh_token")] = None,
    data: RefreshTokenRequest = RefreshTokenRequest(),
    db: Database = Depends(get_db),
    redis_client: redis.Redis = Depends(get_redis_blacklist),
):
    """
    Refresh access token using refresh token.
    Implements token rotation - issues new refresh token on every use.
    """
    # Get refresh token from cookie or body
    refresh_token = refresh_token_cookie or data.refresh_token
    
    if not refresh_token:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Refresh token required"
        )
    
    # Decode and validate refresh token
    payload = decode_token(refresh_token)
    if not payload or payload.get("type") != "refresh":
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid refresh token"
        )
    
    # Get user
    user_id = payload.get("sub")
    user = db.users.find_one({"id": user_id})
    if not user or not user.get("is_active", True):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="User not found or inactive"
        )
    
    # Blacklist old refresh token (token rotation)
    old_jti = payload.get("jti")
    if old_jti:
        exp = payload.get("exp", 0)
        ttl = max(0, exp - int(datetime.utcnow().timestamp()))
        await blacklist_token(old_jti, ttl, redis_client)
    
    # Generate new tokens
    token_data = {"sub": user["id"], "email": user["email"], "role": user.get("role", "user")}
    new_access_token = create_access_token(token_data)
    new_refresh_token = create_refresh_token(token_data)
    
    # Set new refresh token in cookie
    _set_refresh_token_cookie(response, new_refresh_token)
    
    # Audit log
    audit_logger.log_token_refresh(user["id"], request)
    
    return TokenResponse(
        access_token=new_access_token,
        refresh_token=None,
        expires_in=settings.JWT_ACCESS_TOKEN_EXPIRE_MINUTES * 60
    )


@router.post("/logout", response_model=MessageResponse)
async def logout(
    request: Request,
    response: Response,
    current_user: Annotated[dict, Depends(get_current_user)],
    redis_client: redis.Redis = Depends(get_redis_blacklist),
    refresh_token_cookie: Annotated[str | None, Cookie(alias="refresh_token")] = None,
):
    """
    Logout user and blacklist current tokens.
    Clears refresh token cookie.
    """
    # Get access token from request
    auth_header = request.headers.get("Authorization", "")
    if auth_header.startswith("Bearer "):
        access_token = auth_header[7:]
        access_payload = decode_token(access_token)
        if access_payload and access_payload.get("jti"):
            exp = access_payload.get("exp", 0)
            ttl = max(0, exp - int(datetime.utcnow().timestamp()))
            await blacklist_token(access_payload["jti"], ttl, redis_client)
    
    # Blacklist refresh token
    if refresh_token_cookie:
        refresh_payload = decode_token(refresh_token_cookie)
        if refresh_payload and refresh_payload.get("jti"):
            exp = refresh_payload.get("exp", 0)
            ttl = max(0, exp - int(datetime.utcnow().timestamp()))
            await blacklist_token(refresh_payload["jti"], ttl, redis_client)
    
    # Clear refresh token cookie
    response.delete_cookie(
        key="refresh_token",
        path="/api/auth",
        domain=settings.COOKIE_DOMAIN or None
    )
    
    # Audit log
    audit_logger.log_logout(current_user["id"], request)
    
    return MessageResponse(message="Logged out successfully")


@router.get("/me", response_model=UserResponse)
async def get_current_user_info(
    current_user: Annotated[dict, Depends(get_current_user)]
):
    """Get current authenticated user information."""
    return _public_user(current_user)


@router.post("/password/change", response_model=MessageResponse)
async def change_password(
    request: Request,
    data: PasswordChange,
    current_user: Annotated[dict, Depends(get_current_user)],
    db: Database = Depends(get_db),
    redis_client: redis.Redis = Depends(get_redis_blacklist),
):
    """
    Change password for authenticated user.
    Revokes all existing tokens for security.
    """
    # Verify current password
    if not verify_password(data.current_password, current_user["hashed_password"]):
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Current password is incorrect"
        )
    
    # Validate new password strength
    is_valid, error_msg = validate_password_strength(data.new_password)
    if not is_valid:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=error_msg
        )
    
    # Check if new password has been breached
    if await check_password_breach(data.new_password):
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="This password has been found in a data breach. Please choose a different password."
        )
    
    # Update password
    db.users.update_one(
        {"id": current_user["id"]},
        {
            "$set": {
                "hashed_password": get_password_hash(data.new_password),
                "updated_at": datetime.utcnow()
            }
        }
    )
    
    # Revoke all existing tokens
    await revoke_all_user_tokens(current_user["id"], redis_client)
    
    # Audit log
    audit_logger.log_password_change(current_user["id"], request)
    
    return MessageResponse(
        message="Password changed successfully",
        detail="All sessions have been logged out. Please login again."
    )


@router.post("/password/reset/request", response_model=MessageResponse)
@limiter.limit(settings.RATE_LIMIT_PASSWORD_RESET)
async def request_password_reset(
    request: Request,
    data: PasswordResetRequest,
    db: Database = Depends(get_db),
    redis_client: redis.Redis = Depends(get_redis_cache),
):
    """
    Request password reset.
    Always returns success to prevent user enumeration.
    """
    user = db.users.find_one({"email": data.email})
    
    # Always return success, even if user doesn't exist (prevent enumeration)
    if user:
        # Generate reset token
        reset_token = generate_password_reset_token()
        
        # Store token in Redis with expiry
        await redis_client.setex(
            f"password_reset:{reset_token}",
            settings.PASSWORD_RESET_TOKEN_EXPIRE_MINUTES * 60,
            user["id"]
        )
        
        # In production, send email with reset link
        # For now, log it (development only)
        if not settings.is_production:
            reset_url = f"{settings.FRONTEND_URL}/reset-password?token={reset_token}"
            print(f"Password reset URL: {reset_url}")
        
        # Audit log
        audit_logger.log_password_reset_request(data.email, request)
    
    return MessageResponse(
        message="If the email exists, a password reset link has been sent"
    )


@router.post("/password/reset/confirm", response_model=MessageResponse)
async def confirm_password_reset(
    request: Request,
    data: PasswordResetConfirm,
    db: Database = Depends(get_db),
    redis_client: redis.Redis = Depends(get_redis_cache),
    blacklist_client: redis.Redis = Depends(get_redis_blacklist),
):
    """
    Confirm password reset with token.
    One-time use token with 15 minute expiry.
    """
    # Get user ID from token
    user_id = await redis_client.get(f"password_reset:{data.token}")
    if not user_id:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Invalid or expired reset token"
        )
    
    # Validate new password
    is_valid, error_msg = validate_password_strength(data.new_password)
    if not is_valid:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=error_msg
        )
    
    # Check if password has been breached
    if await check_password_breach(data.new_password):
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="This password has been found in a data breach. Please choose a different password."
        )
    
    # Update password
    db.users.update_one(
        {"id": user_id},
        {
            "$set": {
                "hashed_password": get_password_hash(data.new_password),
                "updated_at": datetime.utcnow()
            }
        }
    )
    
    # Delete reset token (one-time use)
    await redis_client.delete(f"password_reset:{data.token}")
    
    # Revoke all existing tokens
    await revoke_all_user_tokens(user_id, blacklist_client)
    
    # Audit log
    audit_logger.log_password_reset_complete(user_id, request)
    
    return MessageResponse(
        message="Password reset successfully",
        detail="Please login with your new password"
    )


# MFA Routes
@router.post("/mfa/enable", response_model=MFASetupResponse)
async def enable_mfa(
    request: Request,
    data: MFAEnableRequest,
    current_user: Annotated[dict, Depends(get_current_user)],
    db: Database = Depends(get_db),
):
    """
    Enable MFA for user.
    Returns QR code and backup codes.
    """
    # Verify password
    if not verify_password(data.password, current_user["hashed_password"]):
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Invalid password"
        )
    
    # Generate TOTP secret
    secret = generate_totp_secret()
    uri = generate_totp_uri(secret, current_user["email"])
    qr_code = generate_qr_code(uri)
    
    # Generate backup codes
    backup_codes_list = generate_backup_codes(10)
    plain_codes = [code for code, _ in backup_codes_list]
    hashed_codes = [hashed for _, hashed in backup_codes_list]
    
    # Store secret and backup codes (not yet enabled)
    db.users.update_one(
        {"id": current_user["id"]},
        {
            "$set": {
                "mfa_secret_pending": secret,
                "backup_codes_pending": hashed_codes,
                "updated_at": datetime.utcnow()
            }
        }
    )
    
    return MFASetupResponse(
        secret=secret,
        qr_code=qr_code,
        backup_codes=plain_codes
    )


@router.post("/mfa/verify", response_model=MessageResponse)
async def verify_mfa_setup(
    request: Request,
    data: MFAVerifyRequest,
    current_user: Annotated[dict, Depends(get_current_user)],
    db: Database = Depends(get_db),
):
    """
    Verify MFA setup with first successful code.
    Activates MFA for the account.
    """
    secret = current_user.get("mfa_secret_pending")
    if not secret:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="MFA setup not initiated"
        )
    
    # Verify code
    if not verify_totp_code(secret, data.code):
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Invalid verification code"
        )
    
    # Activate MFA
    db.users.update_one(
        {"id": current_user["id"]},
        {
            "$set": {
                "mfa_enabled": True,
                "mfa_secret": secret,
                "backup_codes": current_user.get("backup_codes_pending", []),
                "updated_at": datetime.utcnow()
            },
            "$unset": {
                "mfa_secret_pending": "",
                "backup_codes_pending": ""
            }
        }
    )
    
    # Audit log
    audit_logger.log_mfa_enabled(current_user["id"], request)
    
    return MessageResponse(message="MFA enabled successfully")


@router.post("/mfa/login", response_model=AuthResponse)
@limiter.limit(settings.RATE_LIMIT_LOGIN)
async def mfa_login(
    request: Request,
    response: Response,
    data: MFAVerifyRequest,
    db: Database = Depends(get_db),
):
    """
    Complete MFA login with TOTP code.
    Requires temp_token from initial login.
    """
    # Get temp token from Authorization header
    auth_header = request.headers.get("Authorization", "")
    if not auth_header.startswith("Bearer "):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Temporary token required"
        )
    
    temp_token = auth_header[7:]
    payload = decode_token(temp_token)
    
    if not payload or not payload.get("mfa_pending"):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid temporary token"
        )
    
    # Get user
    user = db.users.find_one({"id": payload.get("sub")})
    if not user or not user.get("mfa_enabled"):
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="MFA not enabled"
        )
    
    # Verify TOTP code
    if not verify_totp_code(user["mfa_secret"], data.code):
        audit_logger.log_mfa_verification_failure(user["id"], request)
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Invalid verification code"
        )
    
    # Generate full tokens
    token_data = {"sub": user["id"], "email": user["email"], "role": user.get("role", "user"), "mfa_verified": True}
    access_token = create_access_token(token_data)
    refresh_token = create_refresh_token(token_data)
    
    # Set refresh token in cookie
    _set_refresh_token_cookie(response, refresh_token)
    
    # Audit log
    audit_logger.log_mfa_verification_success(user["id"], request)
    audit_logger.log_login_success(user["id"], request)
    
    return AuthResponse(
        user=_public_user(user),
        access_token=access_token,
        refresh_token=None,
        expires_in=settings.JWT_ACCESS_TOKEN_EXPIRE_MINUTES * 60
    )


@router.post("/mfa/disable", response_model=MessageResponse)
async def disable_mfa(
    request: Request,
    data: MFADisableRequest,
    current_user: Annotated[dict, Depends(get_current_user)],
    db: Database = Depends(get_db),
):
    """Disable MFA for user."""
    # Verify password
    if not verify_password(data.password, current_user["hashed_password"]):
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Invalid password"
        )
    
    # Verify MFA code
    if not verify_totp_code(current_user.get("mfa_secret", ""), data.code):
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Invalid verification code"
        )
    
    # Disable MFA
    db.users.update_one(
        {"id": current_user["id"]},
        {
            "$set": {
                "mfa_enabled": False,
                "updated_at": datetime.utcnow()
            },
            "$unset": {
                "mfa_secret": "",
                "backup_codes": ""
            }
        }
    )
    
    # Audit log
    audit_logger.log_mfa_disabled(current_user["id"], request)
    
    return MessageResponse(message="MFA disabled successfully")
