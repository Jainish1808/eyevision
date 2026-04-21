"""
Authentication routes backed by MongoDB.
"""
from datetime import datetime, timedelta
import random
from typing import Annotated
from uuid import uuid4

from fastapi import APIRouter, Depends, HTTPException, status
from fastapi.security import HTTPAuthorizationCredentials, HTTPBearer
from pymongo.database import Database

from app.core.mongodb import get_db
from app.core.security import (
    create_access_token,
    create_refresh_token,
    decode_token,
    get_password_hash,
    verify_password,
)
from app.schemas.user import UserLogin, UserRegister
from config import settings

router = APIRouter(prefix="/api/auth", tags=["Authentication"])
security = HTTPBearer()


def _public_user(doc: dict) -> dict:
    return {
        "id": doc["id"],
        "email": doc["email"],
        "username": doc.get("username", doc.get("name", "")),
        "name": doc.get("name", ""),
        "phone": doc.get("phone"),
        "avatar": doc.get("avatar"),
        "is_active": doc.get("is_active", True),
        "is_verified": doc.get("is_verified", False),
        "created_at": doc.get("created_at"),
    }


def get_current_user(
    credentials: Annotated[HTTPAuthorizationCredentials, Depends(security)],
    db: Database = Depends(get_db),
) -> dict:
    token = credentials.credentials
    payload = decode_token(token)

    if not payload or payload.get("type") != "access":
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid authentication credentials",
        )

    user_id = payload.get("sub")
    user = db.users.find_one({"id": user_id})
    if not user or not user.get("is_active", True):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="User not found or inactive",
        )
    return user


@router.post("/register")
async def register(data: UserRegister, db: Database = Depends(get_db)):
    if db.users.find_one({"email": data.email}):
        raise HTTPException(status_code=400, detail="Email already registered")
    if db.users.find_one({"username": data.username}):
        raise HTTPException(status_code=400, detail="Username already taken")

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
        "created_at": now,
        "updated_at": now,
    }
    db.users.insert_one(user)
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

    token = create_access_token({"sub": user["id"], "email": user["email"]})
    refresh = create_refresh_token({"sub": user["id"], "email": user["email"]})
    return {"user": _public_user(user), "token": token, "refreshToken": refresh}


@router.post("/login")
async def login(data: UserLogin, db: Database = Depends(get_db)):
    user = db.users.find_one({"email": data.email})
    if not user or not user.get("hashed_password"):
        raise HTTPException(status_code=401, detail="Invalid email or password")

    if not verify_password(data.password, user["hashed_password"]):
        raise HTTPException(status_code=401, detail="Invalid email or password")

    if not user.get("is_active", True):
        raise HTTPException(status_code=403, detail="Account is disabled")

    token = create_access_token({"sub": user["id"], "email": user["email"]})
    refresh = create_refresh_token({"sub": user["id"], "email": user["email"]})
    return {"user": _public_user(user), "token": token, "refreshToken": refresh}


@router.post("/refresh")
async def refresh_token(data: dict, db: Database = Depends(get_db)):
    refresh_token = data.get("refreshToken")
    payload = decode_token(refresh_token) if refresh_token else None
    if not payload or payload.get("type") != "refresh":
        raise HTTPException(status_code=401, detail="Invalid refresh token")

    user = db.users.find_one({"id": payload.get("sub")})
    if not user or not user.get("is_active", True):
        raise HTTPException(status_code=401, detail="User not found or inactive")

    token = create_access_token({"sub": user["id"], "email": user["email"]})
    refresh = create_refresh_token({"sub": user["id"], "email": user["email"]})
    return {"token": token, "refreshToken": refresh}


@router.post("/logout")
async def logout():
    return {"message": "Logged out"}


@router.post("/verify-otp")
async def verify_otp(data: dict, db: Database = Depends(get_db)):
    email = (data.get("email") or "").strip().lower()
    otp = (data.get("otp") or "").strip()

    if not email or not otp:
        raise HTTPException(status_code=400, detail="Email and OTP are required")

    now = datetime.utcnow()
    otp_doc = db.email_otps.find_one({"email": email, "otp": otp, "expires_at": {"$gte": now}})
    if not otp_doc:
        raise HTTPException(status_code=400, detail="Invalid or expired OTP")

    user = db.users.find_one({"email": email})
    if not user:
        raise HTTPException(status_code=404, detail="User not found")

    db.users.update_one({"id": user["id"]}, {"$set": {"is_verified": True, "updated_at": now}})
    user = db.users.find_one({"id": user["id"]})
    db.email_otps.delete_many({"email": email})

    token = create_access_token({"sub": user["id"], "email": user["email"]})
    refresh = create_refresh_token({"sub": user["id"], "email": user["email"]})
    return {"user": _public_user(user), "token": token, "refreshToken": refresh}


@router.post("/send-otp")
async def send_otp(data: dict, db: Database = Depends(get_db)):
    email = (data.get("email") or "").strip().lower()
    if not email:
        raise HTTPException(status_code=400, detail="Email is required")

    user = db.users.find_one({"email": email})
    if not user:
        raise HTTPException(status_code=404, detail="User not found")

    now = datetime.utcnow()
    otp = f"{random.randint(0, 999999):06d}"
    expires_at = now + timedelta(minutes=5)

    db.email_otps.update_one(
        {"email": email},
        {
            "$set": {
                "email": email,
                "otp": otp,
                "expires_at": expires_at,
                "updated_at": now,
            },
            "$setOnInsert": {"created_at": now},
        },
        upsert=True,
    )

    response = {
        "message": "OTP generated successfully",
        "expiresInSeconds": 300,
    }

    if not settings.is_production:
        response["debugOtp"] = otp

    return response


@router.get("/me")
async def me(current_user: Annotated[dict, Depends(get_current_user)]):
    return _public_user(current_user)
