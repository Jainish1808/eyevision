"""
Order routes backed by MongoDB.
"""
from datetime import datetime
from typing import Annotated
from uuid import uuid4

from fastapi import APIRouter, Depends, HTTPException
from pymongo import DESCENDING
from pymongo.database import Database

from app.core.mongodb import get_db
from app.routes.auth import get_current_user

router = APIRouter(prefix="/api/orders", tags=["Orders"])


def _order_number() -> str:
    return f"EYE{datetime.utcnow().strftime('%Y%m%d%H%M%S')}"


def _order_response(order: dict) -> dict:
    return {
        "id": order.get("id"),
        "order_number": order.get("order_number"),
        "user_id": order.get("user_id"),
        "status": order.get("status", "pending"),
        "payment_status": order.get("payment_status", "pending"),
        "payment_method": order.get("payment_method"),
        "subtotal": order.get("subtotal", 0),
        "tax_amount": order.get("tax_amount", 0),
        "shipping_amount": order.get("shipping_amount", 0),
        "discount_amount": order.get("discount_amount", 0),
        "total_amount": order.get("total_amount", 0),
        "shipping_address": order.get("shipping_address"),
        "billing_address": order.get("billing_address"),
        "customer_notes": order.get("customer_notes"),
        "items": order.get("items", []),
        "created_at": order.get("created_at"),
        "updated_at": order.get("updated_at"),
    }


@router.post("")
async def create_order(
    order_data: dict,
    current_user: Annotated[dict, Depends(get_current_user)],
    db: Database = Depends(get_db),
):
    cart = db.carts.find_one({"user_id": current_user["id"]}) or {"items": []}
    items = cart.get("items", [])
    if not items:
        raise HTTPException(status_code=400, detail="Cart is empty")

    product_ids = [i["product_id"] for i in items]
    products = list(db.products.find({"id": {"$in": product_ids}, "is_active": True}))
    product_map = {p["id"]: p for p in products}

    order_items = []
    subtotal = 0.0
    for item in items:
        product = product_map.get(item["product_id"])
        if not product:
            raise HTTPException(status_code=400, detail=f"Product {item['product_id']} is not available")

        qty = int(item.get("quantity", 1))
        stock = int(product.get("stock_quantity", 0))
        if stock < qty:
            raise HTTPException(status_code=400, detail=f"Insufficient stock for {product.get('name')}")

        unit_price = float(product.get("price", 0))
        subtotal += unit_price * qty
        order_items.append(
            {
                "id": str(uuid4()),
                "product_id": product["id"],
                "product_name": product.get("name"),
                "product_slug": product.get("slug"),
                "product_image": product.get("primary_image"),
                "quantity": qty,
                "unit_price": unit_price,
                "total_price": round(unit_price * qty, 2),
                "variant": item.get("variant"),
                "prescription": item.get("prescription"),
                "created_at": datetime.utcnow(),
            }
        )

    tax_amount = round(subtotal * 0.18, 2)
    shipping_amount = 0.0 if subtotal > 999 else 99.0
    discount_amount = 0.0
    total_amount = round(subtotal + tax_amount + shipping_amount - discount_amount, 2)

    now = datetime.utcnow()
    order = {
        "id": str(uuid4()),
        "order_number": _order_number(),
        "user_id": current_user["id"],
        "status": "pending",
        "payment_status": "pending",
        "payment_method": order_data.get("payment_method", "card"),
        "subtotal": round(subtotal, 2),
        "tax_amount": tax_amount,
        "shipping_amount": shipping_amount,
        "discount_amount": discount_amount,
        "total_amount": total_amount,
        "shipping_address": order_data.get("shipping_address"),
        "billing_address": order_data.get("billing_address"),
        "customer_notes": order_data.get("customer_notes"),
        "items": order_items,
        "created_at": now,
        "updated_at": now,
    }
    db.orders.insert_one(order)

    for item in order_items:
        db.products.update_one(
            {"id": item["product_id"]},
            {"$inc": {"stock_quantity": -item["quantity"]}, "$set": {"updated_at": now}},
        )

    db.carts.update_one(
        {"user_id": current_user["id"]},
        {"$set": {"items": [], "updated_at": now}},
        upsert=True,
    )

    return _order_response(order)


@router.get("")
async def get_orders(
    current_user: Annotated[dict, Depends(get_current_user)],
    db: Database = Depends(get_db),
):
    orders = list(
        db.orders.find({"user_id": current_user["id"]}).sort("created_at", DESCENDING)
    )
    return {
        "orders": [_order_response(o) for o in orders],
        "total": len(orders),
        "page": 1,
        "limit": len(orders),
        "totalPages": 1,
    }


@router.get("/{order_id}")
async def get_order(
    order_id: str,
    current_user: Annotated[dict, Depends(get_current_user)],
    db: Database = Depends(get_db),
):
    order = db.orders.find_one({"id": order_id, "user_id": current_user["id"]})
    if not order:
        raise HTTPException(status_code=404, detail="Order not found")
    return _order_response(order)


@router.patch("/{order_id}/cancel")
async def cancel_order(
    order_id: str,
    current_user: Annotated[dict, Depends(get_current_user)],
    db: Database = Depends(get_db),
):
    order = db.orders.find_one({"id": order_id, "user_id": current_user["id"]})
    if not order:
        raise HTTPException(status_code=404, detail="Order not found")

    if order.get("status") not in ["pending", "confirmed"]:
        raise HTTPException(status_code=400, detail="Order cannot be cancelled at this stage")

    now = datetime.utcnow()
    db.orders.update_one(
        {"id": order_id},
        {"$set": {"status": "cancelled", "updated_at": now, "cancelled_at": now}},
    )

    for item in order.get("items", []):
        db.products.update_one(
            {"id": item["product_id"]},
            {"$inc": {"stock_quantity": int(item.get("quantity", 0))}, "$set": {"updated_at": now}},
        )

    return {"message": "Order cancelled successfully"}
