"""
User and wishlist routes backed by MongoDB.
"""
from datetime import datetime
from typing import Annotated

from fastapi import APIRouter, Depends, HTTPException
from pymongo.database import Database

from app.core.mongodb import get_db
from app.core.security import get_password_hash, verify_password
from app.routes.auth import get_current_user

router = APIRouter(tags=["Users"])


@router.get("/api/users/me")
async def get_profile(current_user: Annotated[dict, Depends(get_current_user)]):
    return {
        "id": current_user["id"],
        "email": current_user["email"],
        "name": current_user.get("name"),
        "phone": current_user.get("phone"),
        "avatar": current_user.get("avatar"),
        "is_active": current_user.get("is_active", True),
        "is_verified": current_user.get("is_verified", False),
        "created_at": current_user.get("created_at"),
    }


@router.patch("/api/users/me")
async def update_profile(
    data: dict,
    current_user: Annotated[dict, Depends(get_current_user)],
    db: Database = Depends(get_db),
):
    updates = {}
    for key in ["name", "phone", "avatar"]:
        if key in data:
            updates[key] = data[key]

    updates["updated_at"] = datetime.utcnow()
    db.users.update_one({"id": current_user["id"]}, {"$set": updates})
    updated = db.users.find_one({"id": current_user["id"]})
    return {
        "id": updated["id"],
        "email": updated["email"],
        "name": updated.get("name"),
        "phone": updated.get("phone"),
        "avatar": updated.get("avatar"),
        "is_active": updated.get("is_active", True),
        "is_verified": updated.get("is_verified", False),
        "created_at": updated.get("created_at"),
    }


@router.post("/api/users/change-password")
async def change_password(
    data: dict,
    current_user: Annotated[dict, Depends(get_current_user)],
    db: Database = Depends(get_db),
):
    current_password = data.get("current_password")
    new_password = data.get("new_password")

    if not current_password or not new_password:
        raise HTTPException(status_code=400, detail="current_password and new_password are required")

    hashed = current_user.get("hashed_password")
    if not hashed or not verify_password(current_password, hashed):
        raise HTTPException(status_code=400, detail="Current password is incorrect")

    db.users.update_one(
        {"id": current_user["id"]},
        {"$set": {"hashed_password": get_password_hash(new_password), "updated_at": datetime.utcnow()}},
    )
    return {"message": "Password changed successfully"}


@router.get("/api/wishlist")
async def get_wishlist(
    current_user: Annotated[dict, Depends(get_current_user)],
    db: Database = Depends(get_db),
):
    doc = db.wishlists.find_one({"user_id": current_user["id"]}) or {"product_ids": []}
    product_ids = doc.get("product_ids", [])
    products = list(db.products.find({"id": {"$in": product_ids}, "is_active": True})) if product_ids else []
    product_map = {p["id"]: p for p in products}

    items = []
    for pid in product_ids:
        p = product_map.get(pid)
        if not p:
            continue
        items.append(
            {
                "id": pid,
                "product_id": pid,
                "product": {
                    "id": p.get("id"),
                    "name": p.get("name"),
                    "slug": p.get("slug"),
                    "brand": p.get("brand"),
                    "price": p.get("price"),
                    "primary_image": p.get("primary_image"),
                    "rating": p.get("rating", 0),
                },
                "created_at": doc.get("updated_at"),
            }
        )

    return {"items": items, "total": len(items)}


@router.post("/api/wishlist")
async def add_to_wishlist(
    data: dict,
    current_user: Annotated[dict, Depends(get_current_user)],
    db: Database = Depends(get_db),
):
    product_id = data.get("productId") or data.get("product_id")
    if not product_id:
        raise HTTPException(status_code=400, detail="productId is required")

    product = db.products.find_one({"id": product_id, "is_active": True})
    if not product:
        raise HTTPException(status_code=404, detail="Product not found")

    db.wishlists.update_one(
        {"user_id": current_user["id"]},
        {
            "$setOnInsert": {"user_id": current_user["id"], "product_ids": []},
            "$addToSet": {"product_ids": product_id},
            "$set": {"updated_at": datetime.utcnow()},
        },
        upsert=True,
    )
    return {"message": "Added to wishlist"}


@router.delete("/api/wishlist/{product_id}")
async def remove_from_wishlist(
    product_id: str,
    current_user: Annotated[dict, Depends(get_current_user)],
    db: Database = Depends(get_db),
):
    db.wishlists.update_one(
        {"user_id": current_user["id"]},
        {
            "$pull": {"product_ids": product_id},
            "$set": {"updated_at": datetime.utcnow()},
        },
        upsert=True,
    )
    return {"message": "Removed from wishlist"}
