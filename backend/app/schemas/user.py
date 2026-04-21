"""
Pydantic schemas for user-related requests and responses.
"""
import re
from pydantic import BaseModel, EmailStr, Field, field_validator, model_validator
from typing import Optional, List
from datetime import datetime


USERNAME_REGEX = re.compile(r"^[a-zA-Z][a-zA-Z0-9_]{2,29}$")
PHONE_REGEX = re.compile(r"^\+?[1-9]\d{7,14}$")
PASSWORD_LOWER_REGEX = re.compile(r"[a-z]")
PASSWORD_UPPER_REGEX = re.compile(r"[A-Z]")
PASSWORD_DIGIT_REGEX = re.compile(r"\d")
PASSWORD_SPECIAL_REGEX = re.compile(r"[^A-Za-z0-9]")


# ---------- Authentication Schemas ----------
class UserLogin(BaseModel):
    """Login request schema."""
    email: EmailStr
    password: str = Field(..., min_length=1)

    @field_validator("email")
    @classmethod
    def normalize_email(cls, value: str) -> str:
        return value.strip().lower()


class UserRegister(BaseModel):
    """Registration request schema."""
    username: str = Field(..., min_length=3, max_length=30)
    email: EmailStr
    phone: str
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

    @field_validator("password")
    @classmethod
    def validate_password(cls, value: str) -> str:
        if not PASSWORD_LOWER_REGEX.search(value):
            raise ValueError("Password must contain at least one lowercase letter")
        if not PASSWORD_UPPER_REGEX.search(value):
            raise ValueError("Password must contain at least one uppercase letter")
        if not PASSWORD_DIGIT_REGEX.search(value):
            raise ValueError("Password must contain at least one digit")
        if not PASSWORD_SPECIAL_REGEX.search(value):
            raise ValueError("Password must contain at least one special character")
        return value

    @model_validator(mode="after")
    def validate_confirm_password(self):
        if self.password != self.confirm_password:
            raise ValueError("Password and confirm password must match")
        return self


class UserGoogleAuth(BaseModel):
    """Google authentication request schema."""
    idToken: str = Field(..., min_length=1)


class RefreshTokenRequest(BaseModel):
    """Refresh token request schema."""
    refreshToken: str


class ForgotPasswordRequest(BaseModel):
    """Forgot password request schema."""
    email: EmailStr


class ResetPasswordRequest(BaseModel):
    """Reset password request schema."""
    token: str
    new_password: str = Field(..., min_length=8, max_length=128)


# ---------- Response Schemas ----------
class UserBase(BaseModel):
    """Base user schema."""
    id: str
    email: str
    username: str
    name: str
    phone: Optional[str] = None
    avatar: Optional[str] = None


class UserResponse(UserBase):
    """User response schema."""
    is_active: bool
    is_verified: bool
    created_at: Optional[datetime] = None

    class Config:
        from_attributes = True


class AuthResponse(BaseModel):
    """Authentication response schema."""
    user: UserResponse
    token: str
    refreshToken: str


class TokenResponse(BaseModel):
    """Token-only response schema."""
    token: str
    refreshToken: str


# ---------- Update Schemas ----------
class UserUpdate(BaseModel):
    """User profile update schema."""
    name: Optional[str] = Field(None, min_length=1, max_length=255)
    phone: Optional[str] = None
    avatar: Optional[str] = None


class UserPasswordChange(BaseModel):
    """Password change schema."""
    current_password: str
    new_password: str = Field(..., min_length=8, max_length=128)


# ---------- Address Schemas ----------
class AddressBase(BaseModel):
    """Base address schema."""
    name: str
    street: str
    city: str
    state: str
    country: str
    zip_code: str
    phone: str
    is_default: bool = False


class AddressCreate(AddressBase):
    """Address creation schema."""
    user_id: str


class AddressResponse(AddressBase):
    """Address response schema."""
    id: str
    user_id: str
    created_at: datetime
    updated_at: Optional[datetime] = None

    class Config:
        from_attributes = True
