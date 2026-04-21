"""
Application configuration and settings.
Loads environment variables and provides validated settings.
"""
from functools import lru_cache
from pydantic_settings import BaseSettings, SettingsConfigDict
from pydantic import Field
from typing import List


class Settings(BaseSettings):
    """Application settings loaded from environment variables."""

    model_config = SettingsConfigDict(
        env_file=".env",
        case_sensitive=True,
        extra="ignore",
    )

    # ---------- Application ----------
    APP_NAME: str = "Eyewear E-commerce API"
    APP_ENV: str = "development"
    DEBUG: bool = True
    API_PREFIX: str = "/api"

    # ---------- Database ----------
    DATABASE_URL: str = "sqlite+aiosqlite:///./eyewear.db"
    MONGODB_URL: str = "mongodb://localhost:27017"
    MONGODB_DB_NAME: str = "eyewear"

    # ---------- Redis ----------
    REDIS_URL: str = "redis://localhost:6379/0"
    REDIS_SESSION_DB: int = 1
    REDIS_CACHE_DB: int = 2

    # ---------- JWT ----------
    JWT_SECRET: str = "changeme-in-production-use-openssl-rand-hex-32"
    JWT_ALGORITHM: str = "HS256"
    JWT_ACCESS_TOKEN_EXPIRE_MINUTES: int = 15  # Short-lived access tokens
    JWT_REFRESH_TOKEN_EXPIRE_DAYS: int = 7  # Long-lived refresh tokens

    # ---------- Session ----------
    SESSION_SECRET_KEY: str = "changeme-session-secret-use-openssl-rand-hex-32"
    SESSION_MAX_AGE: int = 86400  # 24 hours
    SESSION_IDLE_TIMEOUT: int = 3600  # 1 hour
    SESSION_ABSOLUTE_TIMEOUT: int = 86400  # 24 hours

    # ---------- OAuth2 ----------
    GOOGLE_CLIENT_ID: str = ""
    GOOGLE_CLIENT_SECRET: str = ""
    GITHUB_CLIENT_ID: str = ""
    GITHUB_CLIENT_SECRET: str = ""
    OAUTH_REDIRECT_URI: str = "http://localhost:8000/api/auth/oauth/callback"

    # ---------- Security ----------
    SECRET_KEY: str = "changeme-secret-key-use-openssl-rand-hex-32"
    ENCRYPTION_KEY: str = ""  # For encrypting OAuth tokens in DB (32 bytes base64)
    
    # Password Reset
    PASSWORD_RESET_TOKEN_EXPIRE_MINUTES: int = 15
    
    # MFA
    MFA_ISSUER_NAME: str = "Eyewear Store"
    
    # CSRF
    CSRF_SECRET: str = "changeme-csrf-secret"

    # ---------- CORS ----------
    CORS_ORIGINS: str = "http://localhost:5173,http://localhost:3000"
    CORS_ALLOW_CREDENTIALS: bool = True

    # ---------- Rate Limiting ----------
    RATE_LIMIT_LOGIN: str = "5/minute"
    RATE_LIMIT_REGISTER: str = "3/minute"
    RATE_LIMIT_API: str = "100/minute"
    RATE_LIMIT_PASSWORD_RESET: str = "3/hour"

    # ---------- Cookie Settings ----------
    COOKIE_SECURE: bool = False  # Set True in production with HTTPS
    COOKIE_SAMESITE: str = "lax"  # "strict", "lax", or "none"
    COOKIE_DOMAIN: str = ""  # Set in production

    # ---------- Security Headers ----------
    HSTS_MAX_AGE: int = 31536000  # 1 year
    CSP_POLICY: str = "default-src 'self'; script-src 'self'; style-src 'self' 'unsafe-inline'; img-src 'self' data: https:; font-src 'self' data:;"

    # ---------- Audit Logging ----------
    AUDIT_LOG_ENABLED: bool = True
    AUDIT_LOG_FILE: str = "logs/audit.log"

    # ---------- Frontend URL ----------
    FRONTEND_URL: str = "http://localhost:5173"

    @property
    def cors_origins_list(self) -> List[str]:
        """Parse CORS origins from comma-separated string."""
        return [origin.strip() for origin in self.CORS_ORIGINS.split(",")]

    @property
    def is_production(self) -> bool:
        """Check if running in production mode."""
        return self.APP_ENV.lower() == "production"


@lru_cache()
def get_settings() -> Settings:
    """Get cached settings instance."""
    return Settings()


# Global settings instance
settings = get_settings()
