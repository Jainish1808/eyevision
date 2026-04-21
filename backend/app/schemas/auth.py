"""
Enhanced Pydantic schemas for authentication with strict validation.
"""
import re
from pydantic import BaseModel, EmailStr, Field, field_validator, model_validator, ConfigDict
from typing import Optional, List
from datetime import datetime


USERNAME_REGEX = re.compile(r"^[a-zA-Z][a-zA-Z0-9_]{2,29}$")
PHONE_REGEX = re.compile(r"^\+?[1-9]\d{7,14}$")


class StrictBaseModel(BaseModel):
    """Base model with strict validation - rejects extra fields."""
    model_config = ConfigDict(extra='forbid', str_strip_whitespace=True)


# ---------- Authentication Schemas ----------
class UserLogin(StrictBaseModel):
    """Login request schema."""
    email: EmailStr
    password: str = Field(..., min_length=1, max_length=128)

    @field_validator("email")
    @classmethod
    def normalize_email(cls, value: str) -> str:
        return value.strip().lower()


class UserRegister(StrictBaseModel):
    """Registration request schema with strict password validation."""
    username: str = Field(..., min_length=3, max_length=30)
    email: EmailStr
    phone: str = Field(..., min_length=8, max_length=20)
    password: str = Field(..., min_length=8, max_length=128)
    confirm_password: str = Field(..., min_length=8, max_length=128)

    @field_validator("username")
    @classmethod
    def validate_username(cls, value: str) -> str:
        username = value.strip()
        if not USERNAME_REGEX.match(username):
            raise ValueError(
                "Username must start with a letter and contain only letters, numbers, or underscore (3-30 chars)"
            )
        return username

    @field_validator("email")
    @classmethod
    def validate_email(cls, value: str) -> str:
        return value.strip().lower()

    @field_validator("phone")
    @classmethod
    def validate_phone(cls, value: str) -> str:
        normalized_phone = value.strip().replace(" ", "").replace("-", "")
        if not PHONE_REGEX.match(normalized_phone):
            raise ValueError("Phone must be in valid international format, e.g. +919876543210")
        return normalized_phone

    @model_validator(mode="after")
    def validate_passwords_match(self):
        if self.password != self.confirm_password:
            raise ValueError("Passwords do not match")
        return self


class RefreshTokenRequest(StrictBaseModel):
    """Refresh token request schema."""
    refresh_token: Optional[str] = None  # Can also come from cookie


class PasswordResetRequest(StrictBaseModel):
    """Password reset request schema."""
    email: EmailStr

    @field_validator("email")
    @classmethod
    def normalize_email(cls, value: str) -> str:
        return value.strip().lower()


class PasswordResetConfirm(StrictBaseModel):
    """Password reset confirmation schema."""
    token: str = Field(..., min_length=1)
    new_password: str = Field(..., min_length=8, max_length=128)
    confirm_password: str = Field(..., min_length=8, max_length=128)

    @model_validator(mode="after")
    def validate_passwords_match(self):
        if self.new_password != self.confirm_password:
            raise ValueError("Passwords do not match")
        return self


class PasswordChange(StrictBaseModel):
    """Password change schema."""
    current_password: str = Field(..., min_length=1)
    new_password: str = Field(..., min_length=8, max_length=128)
    confirm_password: str = Field(..., min_length=8, max_length=128)

    @model_validator(mode="after")
    def validate_passwords_match(self):
        if self.new_password != self.confirm_password:
            raise ValueError("Passwords do not match")
        return self


# ---------- MFA Schemas ----------
class MFAEnableRequest(StrictBaseModel):
    """MFA enable request schema."""
    password: str = Field(..., min_length=1)


class MFAVerifyRequest(StrictBaseModel):
    """MFA verification request schema."""
    code: str = Field(..., min_length=6, max_length=6, pattern=r"^\d{6}$")


class MFADisableRequest(StrictBaseModel):
    """MFA disable request schema."""
    password: str = Field(..., min_length=1)
    code: str = Field(..., min_length=6, max_length=6, pattern=r"^\d{6}$")


class BackupCodeVerifyRequest(StrictBaseModel):
    """Backup code verification schema."""
    code: str = Field(..., min_length=9, max_length=9, pattern=r"^[A-F0-9]{4}-[A-F0-9]{4}$")


# ---------- Response Schemas ----------
class UserResponse(BaseModel):
    """User response schema."""
    id: str
    email: str
    username: str
    name: str
    phone: Optional[str] = None
    avatar: Optional[str] = None
    is_active: bool
    is_verified: bool
    role: str = "user"
    mfa_enabled: bool = False
    created_at: Optional[datetime] = None

    model_config = ConfigDict(from_attributes=True)


class AuthResponse(BaseModel):
    """Authentication response schema."""
    user: UserResponse
    access_token: str
    refresh_token: Optional[str] = None  # May be in HttpOnly cookie
    token_type: str = "bearer"
    expires_in: int = Field(default=900)  # 15 minutes in seconds


class TokenResponse(BaseModel):
    """Token refresh response schema."""
    access_token: str
    refresh_token: Optional[str] = None
    token_type: str = "bearer"
    expires_in: int = Field(default=900)


class MFASetupResponse(BaseModel):
    """MFA setup response with QR code."""
    secret: str
    qr_code: str  # Base64 encoded image
    backup_codes: List[str]


class MessageResponse(BaseModel):
    """Generic message response."""
    message: str
    detail: Optional[str] = None


# ---------- OAuth Schemas ----------
class OAuthCallbackRequest(StrictBaseModel):
    """OAuth callback request schema."""
    code: str = Field(..., min_length=1)
    state: str = Field(..., min_length=1)
    code_verifier: Optional[str] = None  # For PKCE
