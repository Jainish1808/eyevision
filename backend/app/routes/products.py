"""
Product routes backed by MongoDB.
"""
from typing import Optional

from fastapi import APIRouter, Depends, HTTPException, Query
from pymongo import ASCENDING, DESCENDING
from pymongo.database import Database

from app.core.mongodb import get_db

router = APIRouter(prefix="/api/products", tags=["Products"])


def _product_to_response(product: dict) -> dict:
    return {
        "id": product.get("id"),
        "name": product.get("name"),
        "slug": product.get("slug"),
        "brand": product.get("brand"),
        "description": product.get("description"),
        "category_id": product.get("category_id"),
        "gender": product.get("gender", "unisex"),
        "price": product.get("price", 0),
        "original_price": product.get("original_price"),
        "currency": product.get("currency", "INR"),
        "primary_image": product.get("primary_image"),
        "rating": product.get("rating", 0),
        "review_count": product.get("review_count", 0),
        "stock_quantity": product.get("stock_quantity", 0),
        "low_stock_threshold": product.get("low_stock_threshold", 10),
        "is_active": product.get("is_active", True),
        "is_featured": product.get("is_featured", False),
        "is_new_arrival": product.get("is_new_arrival", False),
        "tags": product.get("tags", []),
        "created_at": product.get("created_at"),
        "updated_at": product.get("updated_at"),
    }


@router.get("")
async def get_products(
    category: Optional[str] = None,
    brand: Optional[str] = None,
    min_price: Optional[float] = None,
    max_price: Optional[float] = None,
    gender: Optional[str] = None,
    sort: str = "newest",
    page: int = 1,
    limit: int = 20,
    search: Optional[str] = None,
    db: Database = Depends(get_db),
):
    filters = {"is_active": True}
    if category:
        filters["category_id"] = category
    if brand:
        filters["brand"] = brand
    if gender:
        filters["gender"] = gender

    if min_price is not None or max_price is not None:
        filters["price"] = {}
        if min_price is not None:
            filters["price"]["$gte"] = min_price
        if max_price is not None:
            filters["price"]["$lte"] = max_price

    if search:
        filters["$or"] = [
            {"name": {"$regex": search, "$options": "i"}},
            {"description": {"$regex": search, "$options": "i"}},
            {"brand": {"$regex": search, "$options": "i"}},
        ]

    sort_field = "created_at"
    sort_dir = DESCENDING
    if sort == "price_asc":
        sort_field = "price"
        sort_dir = ASCENDING
    elif sort == "price_desc":
        sort_field = "price"
        sort_dir = DESCENDING
    elif sort == "rating":
        sort_field = "rating"
        sort_dir = DESCENDING
    elif sort == "popular":
        sort_field = "review_count"
        sort_dir = DESCENDING

    total = db.products.count_documents(filters)
    products = list(
        db.products.find(filters)
        .sort(sort_field, sort_dir)
        .skip((page - 1) * limit)
        .limit(limit)
    )

    return {
        "products": [_product_to_response(p) for p in products],
        "total": total,
        "page": page,
        "limit": limit,
        "totalPages": (total + limit - 1) // limit,
    }


@router.get("/trending")
async def get_trending_products(limit: int = 8, db: Database = Depends(get_db)):
    products = list(
        db.products.find({"is_active": True, "is_featured": True})
        .sort([("rating", DESCENDING), ("review_count", DESCENDING)])
        .limit(limit)
    )
    return [_product_to_response(p) for p in products]


@router.get("/new-arrivals")
async def get_new_arrivals(limit: int = 8, db: Database = Depends(get_db)):
    products = list(
        db.products.find({"is_active": True, "is_new_arrival": True})
        .sort("created_at", DESCENDING)
        .limit(limit)
    )
    return [_product_to_response(p) for p in products]


@router.get("/search")
async def search_products(
    q: str = Query(..., min_length=1),
    limit: int = 20,
    db: Database = Depends(get_db),
):
    filters = {
        "is_active": True,
        "$or": [
            {"name": {"$regex": q, "$options": "i"}},
            {"description": {"$regex": q, "$options": "i"}},
            {"brand": {"$regex": q, "$options": "i"}},
        ],
    }
    products = list(db.products.find(filters).limit(limit))
    return [_product_to_response(p) for p in products]


@router.get("/categories")
async def get_categories(db: Database = Depends(get_db)):
    categories = list(db.categories.find({"is_active": True}).sort("display_order", ASCENDING))
    return [
        {
            "id": c.get("id"),
            "name": c.get("name"),
            "slug": c.get("slug"),
            "icon": c.get("icon"),
            "description": c.get("description"),
        }
        for c in categories
    ]


@router.get("/{product_id}")
async def get_product(product_id: str, db: Database = Depends(get_db)):
    product = db.products.find_one(
        {
            "$or": [{"id": product_id}, {"slug": product_id}],
            "is_active": True,
        }
    )
    if not product:
        raise HTTPException(status_code=404, detail="Product not found")
    return _product_to_response(product)


@router.get("/{product_id}/related")
async def get_related_products(product_id: str, limit: int = 8, db: Database = Depends(get_db)):
    product = db.products.find_one({"id": product_id})
    if not product:
        raise HTTPException(status_code=404, detail="Product not found")

    related = list(
        db.products.find(
            {
                "is_active": True,
                "id": {"$ne": product_id},
                "category_id": product.get("category_id"),
            }
        )
        .sort("rating", DESCENDING)
        .limit(limit)
    )
    return [_product_to_response(p) for p in related]
