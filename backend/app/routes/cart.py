"""
Cart routes backed by MongoDB.
"""
from datetime import datetime
from typing import Annotated
from uuid import uuid4

from fastapi import APIRouter, Depends, HTTPException
from pymongo.database import Database

from app.core.mongodb import get_db
from app.routes.auth import get_current_user

router = APIRouter(prefix="/api/cart", tags=["Cart"])


def _get_product_map(db: Database, product_ids: list[str]) -> dict:
    if not product_ids:
        return {}
    products = db.products.find({"id": {"$in": product_ids}})
    return {p["id"]: p for p in products}


def _cart_response(cart: dict, db: Database) -> dict:
    items = cart.get("items", [])
    product_map = _get_product_map(db, [i["product_id"] for i in items])

    total_amount = 0.0
    total_items = 0
    out_items = []
    for item in items:
        product = product_map.get(item["product_id"])
        qty = int(item.get("quantity", 1))
        price = float(product.get("price", 0)) if product else 0.0
        total_amount += price * qty
        total_items += qty
        out_items.append(
            {
                "id": item["id"],
                "product_id": item["product_id"],
                "quantity": qty,
                "variant": item.get("variant"),
                "prescription": item.get("prescription"),
                "product": {
                    "id": product.get("id"),
                    "name": product.get("name"),
                    "price": product.get("price"),
                    "primary_image": product.get("primary_image"),
                    "slug": product.get("slug"),
                }
                if product
                else None,
                "added_at": item.get("added_at"),
            }
        )

    return {
        "id": cart.get("id"),
        "user_id": cart.get("user_id"),
        "items": out_items,
        "total_amount": round(total_amount, 2),
        "total_items": total_items,
        "created_at": cart.get("created_at"),
        "updated_at": cart.get("updated_at"),
    }


def _ensure_cart(db: Database, user_id: str) -> dict:
    now = datetime.utcnow()
    cart = db.carts.find_one({"user_id": user_id})
    if cart:
        return cart
    cart = {
        "id": str(uuid4()),
        "user_id": user_id,
        "items": [],
        "created_at": now,
        "updated_at": now,
    }
    db.carts.insert_one(cart)
    return cart


@router.get("")
async def get_cart(
    current_user: Annotated[dict, Depends(get_current_user)],
    db: Database = Depends(get_db),
):
    cart = _ensure_cart(db, current_user["id"])
    return _cart_response(cart, db)


@router.post("/items")
async def add_to_cart(
    data: dict,
    current_user: Annotated[dict, Depends(get_current_user)],
    db: Database = Depends(get_db),
):
    product_id = data.get("productId") or data.get("product_id")
    quantity = int(data.get("quantity", 1))
    if not product_id:
        raise HTTPException(status_code=400, detail="productId is required")

    product = db.products.find_one({"id": product_id, "is_active": True})
    if not product:
        raise HTTPException(status_code=404, detail="Product not found")

    cart = _ensure_cart(db, current_user["id"])
    items = cart.get("items", [])
    existing = next((i for i in items if i["product_id"] == product_id), None)

    now = datetime.utcnow()
    if existing:
        existing["quantity"] += quantity
    else:
        items.append(
            {
                "id": str(uuid4()),
                "product_id": product_id,
                "quantity": quantity,
                "variant": data.get("variant"),
                "prescription": data.get("prescription"),
                "added_at": now,
            }
        )

    db.carts.update_one(
        {"user_id": current_user["id"]},
        {"$set": {"items": items, "updated_at": now}},
        upsert=True,
    )
    cart = db.carts.find_one({"user_id": current_user["id"]})
    return _cart_response(cart, db)


@router.patch("/items/{item_id}")
async def update_cart_item(
    item_id: str,
    data: dict,
    current_user: Annotated[dict, Depends(get_current_user)],
    db: Database = Depends(get_db),
):
    quantity = int(data.get("quantity", 1))
    cart = _ensure_cart(db, current_user["id"])

    items = cart.get("items", [])
    idx = next((i for i, item in enumerate(items) if item["id"] == item_id), -1)
    if idx < 0:
        raise HTTPException(status_code=404, detail="Cart item not found")

    if quantity <= 0:
        items.pop(idx)
    else:
        items[idx]["quantity"] = quantity

    db.carts.update_one(
        {"user_id": current_user["id"]},
        {"$set": {"items": items, "updated_at": datetime.utcnow()}},
    )
    cart = db.carts.find_one({"user_id": current_user["id"]})
    return _cart_response(cart, db)


@router.delete("/items/{item_id}")
async def remove_from_cart(
    item_id: str,
    current_user: Annotated[dict, Depends(get_current_user)],
    db: Database = Depends(get_db),
):
    cart = _ensure_cart(db, current_user["id"])
    items = [i for i in cart.get("items", []) if i["id"] != item_id]
    db.carts.update_one(
        {"user_id": current_user["id"]},
        {"$set": {"items": items, "updated_at": datetime.utcnow()}},
    )
    updated = db.carts.find_one({"user_id": current_user["id"]})
    return _cart_response(updated, db)


@router.delete("")
async def clear_cart(
    current_user: Annotated[dict, Depends(get_current_user)],
    db: Database = Depends(get_db),
):
    db.carts.update_one(
        {"user_id": current_user["id"]},
        {"$set": {"items": [], "updated_at": datetime.utcnow()}},
        upsert=True,
    )
    return {"message": "Cart cleared"}
