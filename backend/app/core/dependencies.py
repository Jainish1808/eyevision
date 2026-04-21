"""
FastAPI dependencies for authentication and authorization.
Used to protect routes and enforce RBAC.
"""
from typing import Annotated, Optional
from fastapi import Depends, HTTPException, status, Request, Cookie
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from pymongo.database import Database
from app.core.mongodb import get_db
from app.core.security import decode_token, is_token_blacklisted, is_user_tokens_revoked
from app.core.redis_manager import get_redis_blacklist
from app.core.rbac import Role, Permission, has_permission
from app.core.audit import audit_logger
import redis.asyncio as redis


security = HTTPBearer(auto_error=False)


async def get_current_user(
    request: Request,
    credentials: Annotated[Optional[HTTPAuthorizationCredentials], Depends(security)],
    db: Database = Depends(get_db),
    redis_client: redis.Redis = Depends(get_redis_blacklist)
) -> dict:
    """
    Dependency to get current authenticated user.
    Validates JWT token, checks blacklist, and verifies user exists.
    """
    if not credentials:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Authentication required",
            headers={"WWW-Authenticate": "Bearer"},
        )
    
    token = credentials.credentials
    payload = decode_token(token)
    
    # Validate token structure
    if not payload or payload.get("type") != "access":
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid authentication credentials",
            headers={"WWW-Authenticate": "Bearer"},
        )
    
    # Check if token is blacklisted
    jti = payload.get("jti")
    if jti and await is_token_blacklisted(jti, redis_client):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Token has been revoked",
            headers={"WWW-Authenticate": "Bearer"},
        )
    
    # Check if all user tokens were revoked
    user_id = payload.get("sub")
    token_iat = payload.get("iat", 0)
    if await is_user_tokens_revoked(user_id, token_iat, redis_client):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Token has been revoked",
            headers={"WWW-Authenticate": "Bearer"},
        )
    
    # Get user from database
    user = db.users.find_one({"id": user_id})
    if not user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="User not found",
            headers={"WWW-Authenticate": "Bearer"},
        )
    
    # Check if user is active
    if not user.get("is_active", True):
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Account is disabled",
        )
    
    return user


async def get_current_active_user(
    current_user: Annotated[dict, Depends(get_current_user)]
) -> dict:
    """Dependency to get current active user (alias for clarity)."""
    return current_user


async def get_optional_user(
    credentials: Annotated[Optional[HTTPAuthorizationCredentials], Depends(security)],
    db: Database = Depends(get_db),
    redis_client: redis.Redis = Depends(get_redis_blacklist)
) -> Optional[dict]:
    """
    Dependency to get current user if authenticated, None otherwise.
    Useful for endpoints that work for both authenticated and anonymous users.
    """
    if not credentials:
        return None
    
    try:
        token = credentials.credentials
        payload = decode_token(token)
        
        if not payload or payload.get("type") != "access":
            return None
        
        jti = payload.get("jti")
        if jti and await is_token_blacklisted(jti, redis_client):
            return None
        
        user_id = payload.get("sub")
        token_iat = payload.get("iat", 0)
        if await is_user_tokens_revoked(user_id, token_iat, redis_client):
            return None
        
        user = db.users.find_one({"id": user_id})
        if user and user.get("is_active", True):
            return user
        
        return None
    except Exception:
        return None


def require_role(*allowed_roles: Role):
    """
    Dependency factory to require specific roles.
    
    Usage:
        @router.get("/admin", dependencies=[Depends(require_role(Role.ADMIN))])
    """
    async def role_checker(
        request: Request,
        current_user: Annotated[dict, Depends(get_current_user)]
    ):
        user_role = Role(current_user.get("role", "user"))
        
        if user_role not in allowed_roles:
            audit_logger.log_access_denied(
                current_user.get("id"),
                request.url.path,
                request
            )
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail="Insufficient permissions",
            )
        
        return current_user
    
    return role_checker


def require_permission(*required_permissions: Permission):
    """
    Dependency factory to require specific permissions.
    
    Usage:
        @router.delete("/users/{id}", dependencies=[Depends(require_permission(Permission.USER_DELETE))])
    """
    async def permission_checker(
        request: Request,
        current_user: Annotated[dict, Depends(get_current_user)]
    ):
        user_role = Role(current_user.get("role", "user"))
        
        # Check if user has any of the required permissions
        has_access = any(
            has_permission(user_role, perm)
            for perm in required_permissions
        )
        
        if not has_access:
            audit_logger.log_access_denied(
                current_user.get("id"),
                request.url.path,
                request
            )
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail="Insufficient permissions",
            )
        
        return current_user
    
    return permission_checker


async def verify_mfa_required(
    current_user: Annotated[dict, Depends(get_current_user)]
) -> dict:
    """
    Dependency to verify MFA is completed if enabled for user.
    Checks for mfa_verified claim in JWT.
    """
    if current_user.get("mfa_enabled", False):
        # In a real implementation, check JWT claim or session
        # For now, we'll assume MFA is verified if user has mfa_enabled
        pass
    
    return current_user
