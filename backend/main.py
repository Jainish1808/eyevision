"""
Eyewear E-commerce API - FastAPI Application with Complete Security.
"""
import uvicorn
from contextlib import asynccontextmanager

from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi.middleware.gzip import GZipMiddleware
from fastapi.middleware.trustedhost import TrustedHostMiddleware
from fastapi.responses import JSONResponse
from slowapi.errors import RateLimitExceeded

from config import settings
from app.core.redis_manager import redis_manager
from app.core.middleware import (
    SecurityHeadersMiddleware,
    CSRFMiddleware,
    limiter,
    _rate_limit_exceeded_handler
)
from app.routes import auth_secure, products, cart, user, orders


@asynccontextmanager
async def lifespan(app: FastAPI):
    """Application lifespan manager."""
    # Startup
    print("🚀 Starting application...")
    print(f"📦 Environment: {settings.APP_ENV}")
    print(f"🔒 Security: {'PRODUCTION MODE' if settings.is_production else 'DEVELOPMENT MODE'}")
    
    yield
    
    # Shutdown
    print("🛑 Shutting down application...")
    await redis_manager.close_all()
    print("✅ Cleanup complete")


app = FastAPI(
    title=settings.APP_NAME,
    description="Production-grade secure API for eyewear e-commerce",
    version="3.0.0",
    lifespan=lifespan,
    docs_url="/docs" if settings.DEBUG else None,  # Disable docs in production
    redoc_url="/redoc" if settings.DEBUG else None,
)

# ============================================================================
# SECURITY MIDDLEWARE (Order matters!)
# ============================================================================

# 1. Trusted Host Middleware - Prevent Host Header attacks
if settings.is_production:
    allowed_hosts = ["yourdomain.com", "www.yourdomain.com", "api.yourdomain.com"]
    app.add_middleware(TrustedHostMiddleware, allowed_hosts=allowed_hosts)

# 2. Security Headers Middleware
app.add_middleware(SecurityHeadersMiddleware)

# 3. CSRF Protection Middleware
if settings.is_production:
    app.add_middleware(CSRFMiddleware)

# 4. CORS Middleware - Configure carefully
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.cors_origins_list,
    allow_credentials=settings.CORS_ALLOW_CREDENTIALS,
    allow_methods=["GET", "POST", "PUT", "PATCH", "DELETE"],  # Explicit methods
    allow_headers=[
        "Authorization",
        "Content-Type",
        "X-Requested-With",
        "X-CSRF-Token",
    ],
    expose_headers=["X-Total-Count", "X-Page", "X-Per-Page"],
    max_age=3600,  # Cache preflight requests for 1 hour
)

# 5. GZip Compression
app.add_middleware(GZipMiddleware, minimum_size=1000)

# ============================================================================
# RATE LIMITING
# ============================================================================

# Add rate limiter to app state
app.state.limiter = limiter

# Rate limit exceeded handler
@app.exception_handler(RateLimitExceeded)
async def rate_limit_handler(request: Request, exc: RateLimitExceeded):
    return JSONResponse(
        status_code=429,
        content={"detail": "Rate limit exceeded. Please try again later."},
        headers={"Retry-After": "60"}
    )

# ============================================================================
# GLOBAL EXCEPTION HANDLERS
# ============================================================================

@app.exception_handler(Exception)
async def global_exception_handler(request: Request, exc: Exception):
    """
    Global exception handler - never expose internal errors in production.
    """
    if settings.DEBUG:
        # In development, show detailed errors
        import traceback
        return JSONResponse(
            status_code=500,
            content={
                "detail": "Internal server error",
                "error": str(exc),
                "traceback": traceback.format_exc()
            }
        )
    else:
        # In production, return generic error
        return JSONResponse(
            status_code=500,
            content={"detail": "Internal server error"}
        )

# ============================================================================
# ROUTES
# ============================================================================

app.include_router(auth_secure.router)
app.include_router(products.router)
app.include_router(cart.router)
app.include_router(user.router)
app.include_router(orders.router)

# ============================================================================
# HEALTH CHECK & ROOT
# ============================================================================

@app.get("/health")
async def health_check():
    """Health check endpoint for monitoring."""
    return {
        "status": "healthy",
        "app": settings.APP_NAME,
        "version": "3.0.0",
        "environment": settings.APP_ENV,
    }


@app.get("/")
async def root():
    """Root endpoint."""
    return {
        "message": "Eyewear E-commerce API",
        "version": "3.0.0",
        "docs": "/docs" if settings.DEBUG else None,
        "health": "/health",
    }


if __name__ == "__main__":
    uvicorn.run(
        "main:app",
        host="0.0.0.0",
        port=8000,
        reload=settings.DEBUG,
        log_level="info" if settings.DEBUG else "warning",
        access_log=settings.DEBUG,
    )
