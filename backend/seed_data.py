"""
MongoDB seed script.
"""
import os
from datetime import datetime
from uuid import uuid4

from app.core.mongodb import get_mongo_db
from app.core.security import get_password_hash

CATEGORIES = [
    {"name": "Sunglasses", "slug": "sunglasses", "description": "Premium sunglasses with UV protection", "icon": "sunglasses"},
    {"name": "Prescription Glasses", "slug": "prescription-glasses", "description": "Customized prescription eyeglasses", "icon": "glasses"},
    {"name": "Blue Light Glasses", "slug": "blue-light-glasses", "description": "Protect your eyes from screen glare", "icon": "monitor"},
]

PRODUCTS = [
    {"name": "Aviator Classic", "slug": "aviator-classic", "brand": "RayVision", "category_slug": "sunglasses", "description": "Timeless aviator design", "price": 2499, "original_price": 3499, "gender": "unisex", "image": "https://images.unsplash.com/photo-1572635196237-14b3f281503f?w=500", "rating": 4.8, "review_count": 156, "stock": 45, "tags": ["aviator", "classic"], "is_featured": True},
    {"name": "Wayfarer Original", "slug": "wayfarer-original", "brand": "RayVision", "category_slug": "sunglasses", "description": "Iconic wayfarer style", "price": 1899, "original_price": 2699, "gender": "unisex", "image": "https://images.unsplash.com/photo-1577803645773-f96470509666?w=500", "rating": 4.6, "review_count": 203, "stock": 67, "tags": ["wayfarer"], "is_new_arrival": True},
    {"name": "Blue Block Pro", "slug": "blue-block-pro", "brand": "Optica", "category_slug": "blue-light-glasses", "description": "Blue light filtering", "price": 1299, "original_price": 1799, "gender": "unisex", "image": "https://images.unsplash.com/photo-1608231397466-21516a8547f5?w=500", "rating": 4.6, "review_count": 312, "stock": 89, "tags": ["blue-light"], "is_featured": True},
]


def seed_database():
    db = get_mongo_db()
    now = datetime.utcnow()

    db.users.create_index("email", unique=True)
    db.products.create_index("slug", unique=True)
    db.categories.create_index("slug", unique=True)

    admin = db.users.find_one({"email": "admin@eyewear.com"})
    if not admin:
        admin_doc = {
            "id": str(uuid4()),
            "email": "admin@eyewear.com",
            "name": "Admin User",
            "phone": "+91 9876543210",
            "hashed_password": get_password_hash("Admin@123"),
            "avatar": None,
            "is_active": True,
            "is_verified": True,
            "created_at": now,
            "updated_at": now,
        }
        db.users.insert_one(admin_doc)
        print("Created admin user: admin@eyewear.com / Admin@123")

    category_map = {}
    for c in CATEGORIES:
        existing = db.categories.find_one({"slug": c["slug"]})
        if existing:
            category_map[c["slug"]] = existing["id"]
            continue
        doc = {
            "id": str(uuid4()),
            "name": c["name"],
            "slug": c["slug"],
            "description": c.get("description"),
            "icon": c.get("icon"),
            "display_order": 0,
            "is_active": True,
            "created_at": now,
            "updated_at": now,
        }
        db.categories.insert_one(doc)
        category_map[c["slug"]] = doc["id"]
        print(f"Created category: {c['name']}")

    for p in PRODUCTS:
        if db.products.find_one({"slug": p["slug"]}):
            continue
        doc = {
            "id": str(uuid4()),
            "name": p["name"],
            "slug": p["slug"],
            "brand": p["brand"],
            "description": p["description"],
            "category_id": category_map.get(p["category_slug"]),
            "gender": p.get("gender", "unisex"),
            "price": p["price"],
            "original_price": p.get("original_price"),
            "currency": "INR",
            "primary_image": p.get("image"),
            "rating": p.get("rating", 0),
            "review_count": p.get("review_count", 0),
            "stock_quantity": p.get("stock", 0),
            "low_stock_threshold": 10,
            "tags": p.get("tags", []),
            "is_active": True,
            "is_featured": p.get("is_featured", False),
            "is_new_arrival": p.get("is_new_arrival", False),
            "created_at": now,
            "updated_at": now,
        }
        db.products.insert_one(doc)
        print(f"Created product: {p['name']}")

    print("MongoDB seed complete")


if __name__ == "__main__":
    seed_database()
