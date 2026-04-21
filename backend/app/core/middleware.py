"""
Security middleware for rate limiting, CSRF, and security headers.
"""
from fastapi import Request, HTTPException, status
from fastapi.responses import JSONResponse
from slowapi import Limiter, _rate_limit_exceeded_handler
from slowapi.util import get_remote_address
from slowapi.errors import RateLimitExceeded
from starlette.middleware.base import BaseHTTPMiddleware
from starlette.types import ASGIApp
from config import settings
import secrets


# Rate limiter instance
limiter = Limiter(
    key_func=get_remote_address,
    default_limits=["1000/hour"],
    storage_uri=settings.REDIS_URL,
)


class SecurityHeadersMiddleware(BaseHTTPMiddleware):
    """
    Middleware to add security headers to all responses.
    Implements OWASP security header recommendations.
    """
    
    async def dispatch(self, request: Request, call_next):
        response = await call_next(request)
        
        # Strict-Transport-Security (HSTS) - Force HTTPS
        if settings.is_production:
            response.headers["Strict-Transport-Security"] = (
                f"max-age={settings.HSTS_MAX_AGE}; includeSubDomains; preload"
            )
        
        # X-Content-Type-Options - Prevent MIME sniffing
        response.headers["X-Content-Type-Options"] = "nosniff"
        
        # X-Frame-Options - Prevent clickjacking
        response.headers["X-Frame-Options"] = "DENY"
        
        # X-XSS-Protection - Enable XSS filter (legacy browsers)
        response.headers["X-XSS-Protection"] = "1; mode=block"
        
        # Referrer-Policy - Control referrer information
        response.headers["Referrer-Policy"] = "strict-origin-when-cross-origin"
        
        # Content-Security-Policy - Prevent XSS and injection attacks
        response.headers["Content-Security-Policy"] = settings.CSP_POLICY
        
        # Permissions-Policy - Control browser features
        response.headers["Permissions-Policy"] = (
            "geolocation=(), microphone=(), camera=(), payment=()"
        )
        
        # Remove server identification headers
        if "Server" in response.headers:
            del response.headers["Server"]
        if "X-Powered-By" in response.headers:
            del response.headers["X-Powered-By"]
        
        return response


class CSRFMiddleware(BaseHTTPMiddleware):
    """
    CSRF protection middleware using double-submit cookie pattern.
    Validates X-CSRF-Token header against cookie for state-changing requests.
    """
    
    # Methods that require CSRF protection
    PROTECTED_METHODS = {"POST", "PUT", "PATCH", "DELETE"}
    
    # Paths exempt from CSRF (e.g., auth endpoints that use other protection)
    EXEMPT_PATHS = {
        "/api/auth/login",
        "/api/auth/register",
        "/api/auth/refresh",
        "/api/auth/oauth/callback",
        "/docs",
        "/openapi.json",
        "/health",
    }
    
    async def dispatch(self, request: Request, call_next):
        # Skip CSRF check for safe methods and exempt paths
        if request.method not in self.PROTECTED_METHODS:
            return await call_next(request)
        
        if any(request.url.path.startswith(path) for path in self.EXEMPT_PATHS):
            return await call_next(request)
        
        # For SPA: Check X-Requested-With header (simple CSRF protection)
        x_requested_with = request.headers.get("X-Requested-With")
        if x_requested_with == "XMLHttpRequest":
            return await call_next(request)
        
        # Double-submit cookie pattern
        csrf_token_header = request.headers.get("X-CSRF-Token")
        csrf_token_cookie = request.cookies.get("csrf_token")
        
        if not csrf_token_header or not csrf_token_cookie:
            return JSONResponse(
                status_code=status.HTTP_403_FORBIDDEN,
                content={"detail": "CSRF token missing"}
            )
        
        if not secrets.compare_digest(csrf_token_header, csrf_token_cookie):
            return JSONResponse(
                status_code=status.HTTP_403_FORBIDDEN,
                content={"detail": "CSRF token invalid"}
            )
        
        return await call_next(request)


class RateLimitMiddleware(BaseHTTPMiddleware):
    """
    Custom rate limit middleware for additional control.
    Works alongside slowapi for route-specific limits.
    """
    
    async def dispatch(self, request: Request, call_next):
        # Add rate limit info to request state for use in routes
        request.state.rate_limit_key = get_remote_address(request)
        
        try:
            response = await call_next(request)
            return response
        except RateLimitExceeded as e:
            return JSONResponse(
                status_code=status.HTTP_429_TOO_MANY_REQUESTS,
                content={"detail": "Rate limit exceeded"},
                headers={"Retry-After": str(e.retry_after)}
            )


def get_rate_limit_key(request: Request) -> str:
    """
    Get rate limit key combining IP and user ID for authenticated requests.
    Provides more granular rate limiting.
    """
    ip = get_remote_address(request)
    
    # Try to get user ID from token
    auth_header = request.headers.get("Authorization", "")
    if auth_header.startswith("Bearer "):
        # In production, decode token to get user ID
        # For now, use IP only
        return ip
    
    return ip
