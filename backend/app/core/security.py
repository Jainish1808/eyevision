"""
Security utilities for password hashing, JWT token handling, and breach checking.
"""
from datetime import datetime, timedelta
from typing import Optional, Dict
import secrets
import hashlib
import requests
from jose import JWTError, jwt
from passlib.context import CryptContext
from config import settings
import redis.asyncio as redis

# Password hashing context with bcrypt (cost factor 12 for security)
pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto", bcrypt__rounds=12)


def verify_password(plain_password: str, hashed_password: str) -> bool:
    """Verify a plain password against a hashed password."""
    return pwd_context.verify(plain_password, hashed_password)


def get_password_hash(password: str) -> str:
    """Hash a password using bcrypt with cost factor 12."""
    return pwd_context.hash(password)


def validate_password_strength(password: str) -> tuple[bool, str]:
    """
    Validate password meets security requirements.
    Returns (is_valid, error_message).
    """
    if len(password) < 8:
        return False, "Password must be at least 8 characters"
    if len(password) > 128:
        return False, "Password must be less than 128 characters"
    if not any(c.islower() for c in password):
        return False, "Password must contain at least one lowercase letter"
    if not any(c.isupper() for c in password):
        return False, "Password must contain at least one uppercase letter"
    if not any(c.isdigit() for c in password):
        return False, "Password must contain at least one digit"
    if not any(not c.isalnum() for c in password):
        return False, "Password must contain at least one special character"
    return True, ""


async def check_password_breach(password: str) -> bool:
    """
    Check if password has been breached using HaveIBeenPwned API (k-anonymity).
    Returns True if password is breached, False otherwise.
    """
    try:
        # Hash password with SHA-1
        sha1_hash = hashlib.sha1(password.encode()).hexdigest().upper()
        prefix, suffix = sha1_hash[:5], sha1_hash[5:]
        
        # Query HIBP API with first 5 chars only (k-anonymity)
        response = requests.get(
            f"https://api.pwnedpasswords.com/range/{prefix}",
            timeout=3
        )
        
        if response.status_code == 200:
            # Check if our suffix appears in the response
            hashes = (line.split(':') for line in response.text.splitlines())
            return any(hash_suffix == suffix for hash_suffix, _ in hashes)
        
        # If API fails, allow password (fail open for availability)
        return False
    except Exception:
        # Network error or timeout - fail open
        return False


def create_access_token(data: dict, expires_delta: Optional[timedelta] = None) -> str:
    """
    Create a JWT access token with JTI for blacklist support.
    
    Args:
        data: Data to encode (must include 'sub' for user ID)
        expires_delta: Optional custom expiration time
    
    Returns:
        Encoded JWT token string
    """
    to_encode = data.copy()
    expire = datetime.utcnow() + (
        expires_delta or timedelta(minutes=settings.JWT_ACCESS_TOKEN_EXPIRE_MINUTES)
    )
    
    # Add standard JWT claims
    to_encode.update({
        "exp": expire,
        "iat": datetime.utcnow(),
        "type": "access",
        "jti": secrets.token_urlsafe(32),  # Unique token ID for blacklist
    })
    
    return jwt.encode(to_encode, settings.JWT_SECRET, algorithm=settings.JWT_ALGORITHM)


def create_refresh_token(data: dict) -> str:
    """
    Create a JWT refresh token with JTI for rotation.
    
    Args:
        data: Data to encode (must include 'sub' for user ID)
    
    Returns:
        Encoded JWT refresh token string
    """
    to_encode = data.copy()
    expire = datetime.utcnow() + timedelta(days=settings.JWT_REFRESH_TOKEN_EXPIRE_DAYS)
    
    to_encode.update({
        "exp": expire,
        "iat": datetime.utcnow(),
        "type": "refresh",
        "jti": secrets.token_urlsafe(32),  # Unique token ID for rotation
    })
    
    return jwt.encode(to_encode, settings.JWT_SECRET, algorithm=settings.JWT_ALGORITHM)


def decode_token(token: str) -> Optional[Dict]:
    """
    Decode and validate a JWT token.
    
    Args:
        token: JWT token string
    
    Returns:
        Decoded payload or None if invalid
    """
    try:
        payload = jwt.decode(
            token,
            settings.JWT_SECRET,
            algorithms=[settings.JWT_ALGORITHM]
        )
        return payload
    except JWTError:
        return None


async def is_token_blacklisted(jti: str, redis_client: redis.Redis) -> bool:
    """
    Check if a token JTI is blacklisted.
    
    Args:
        jti: JWT ID (jti claim)
        redis_client: Redis client for blacklist
    
    Returns:
        True if blacklisted, False otherwise
    """
    return await redis_client.exists(f"blacklist:{jti}") > 0


async def blacklist_token(jti: str, ttl_seconds: int, redis_client: redis.Redis):
    """
    Add a token JTI to the blacklist.
    
    Args:
        jti: JWT ID (jti claim)
        ttl_seconds: Time to live (should match token remaining lifetime)
        redis_client: Redis client for blacklist
    """
    await redis_client.setex(f"blacklist:{jti}", ttl_seconds, "1")


async def revoke_all_user_tokens(user_id: str, redis_client: redis.Redis):
    """
    Revoke all tokens for a user (e.g., on password change).
    Sets a timestamp; tokens issued before this are invalid.
    
    Args:
        user_id: User ID
        redis_client: Redis client for blacklist
    """
    timestamp = int(datetime.utcnow().timestamp())
    # Store revocation timestamp with 7 days TTL (max refresh token lifetime)
    await redis_client.setex(
        f"revoke_all:{user_id}",
        settings.JWT_REFRESH_TOKEN_EXPIRE_DAYS * 86400,
        str(timestamp)
    )


async def is_user_tokens_revoked(user_id: str, token_iat: int, redis_client: redis.Redis) -> bool:
    """
    Check if all user tokens were revoked after this token was issued.
    
    Args:
        user_id: User ID
        token_iat: Token issued-at timestamp
        redis_client: Redis client for blacklist
    
    Returns:
        True if tokens revoked after this token was issued
    """
    revoke_timestamp = await redis_client.get(f"revoke_all:{user_id}")
    if revoke_timestamp:
        return int(revoke_timestamp) > token_iat
    return False


def generate_password_reset_token() -> str:
    """Generate a cryptographically secure password reset token."""
    return secrets.token_urlsafe(32)


def generate_session_id() -> str:
    """Generate a cryptographically secure session ID."""
    return secrets.token_urlsafe(32)


def generate_csrf_token() -> str:
    """Generate a CSRF token."""
    return secrets.token_urlsafe(32)
