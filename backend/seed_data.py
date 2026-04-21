"""
MongoDB seed script.
"""
import os
from datetime import datetime
from uuid import uuid4

from app.core.mongodb import get_mongo_db
from app.core.security import get_password_hash

CATEGORIES = [
    {"name": "Normal Specs", "slug": "normal-specs", "description": "Everyday eyewear for clear vision", "icon": "👓"},
    {"name": "Sunglasses", "slug": "sunglasses", "description": "Stylish protection from the sun", "icon": "🕶️"},
    {"name": "Lenses", "slug": "lenses", "description": "Premium lenses for all needs", "icon": "🔍"},
    {"name": "Number Glasses", "slug": "number-glasses", "description": "Prescription eyewear", "icon": "📖"},
    {"name": "Cases", "slug": "cases", "description": "Protect your eyewear", "icon": "💼"},
]

PRODUCTS = [
    # Normal Specs
    {"name": "Classic Round Frame", "slug": "classic-round-frame", "brand": "VisionPro", "category_slug": "normal-specs", "description": "Timeless round frame design for everyday wear", "price": 1499, "original_price": 1999, "gender": "unisex", "image": "https://images.unsplash.com/photo-1572635196237-14b3f281503f?w=500", "rating": 4.8, "review_count": 156, "stock": 45, "tags": ["round", "classic"], "is_featured": True},
    {"name": "Rectangle Metal Frame", "slug": "rectangle-metal-frame", "brand": "Optica", "category_slug": "normal-specs", "description": "Sleek metal frame for professional look", "price": 1799, "original_price": 2299, "gender": "unisex", "image": "https://images.unsplash.com/photo-1577803645773-f96470509666?w=500", "rating": 4.6, "review_count": 203, "stock": 67, "tags": ["rectangle", "metal"], "is_new_arrival": True},
    {"name": "Aviator Specs", "slug": "aviator-specs", "brand": "RayVision", "category_slug": "normal-specs", "description": "Aviator style prescription glasses", "price": 2199, "original_price": 2799, "gender": "unisex", "image": "https://images.unsplash.com/photo-1511499767150-a48a237f0083?w=500", "rating": 4.7, "review_count": 189, "stock": 52, "tags": ["aviator"], "is_featured": True},
    
    # Sunglasses
    {"name": "Aviator Classic Sunglasses", "slug": "aviator-classic-sunglasses", "brand": "RayVision", "category_slug": "sunglasses", "description": "Timeless aviator design with UV protection", "price": 2499, "original_price": 3499, "gender": "unisex", "image": "https://images.unsplash.com/photo-1572635196237-14b3f281503f?w=500", "rating": 4.8, "review_count": 256, "stock": 85, "tags": ["aviator", "classic", "uv-protection"], "is_featured": True},
    {"name": "Wayfarer Original", "slug": "wayfarer-original", "brand": "RayVision", "category_slug": "sunglasses", "description": "Iconic wayfarer style sunglasses", "price": 1899, "original_price": 2699, "gender": "unisex", "image": "https://images.unsplash.com/photo-1577803645773-f96470509666?w=500", "rating": 4.6, "review_count": 303, "stock": 97, "tags": ["wayfarer"], "is_new_arrival": True},
    {"name": "Sport Wrap Sunglasses", "slug": "sport-wrap-sunglasses", "brand": "ActiveVision", "category_slug": "sunglasses", "description": "Sporty wrap-around design", "price": 1599, "original_price": 2199, "gender": "unisex", "image": "https://images.unsplash.com/photo-1511499767150-a48a237f0083?w=500", "rating": 4.5, "review_count": 178, "stock": 63, "tags": ["sport", "wrap"], "is_featured": False},
    
    # Lenses
    {"name": "Blue Light Filter Lenses", "slug": "blue-light-filter-lenses", "brand": "LensCraft", "category_slug": "lenses", "description": "Protect your eyes from digital screens", "price": 899, "original_price": 1299, "gender": "unisex", "image": "https://images.unsplash.com/photo-1608231397466-21516a8547f5?w=500", "rating": 4.7, "review_count": 412, "stock": 120, "tags": ["blue-light", "digital"], "is_featured": True},
    {"name": "Photochromic Lenses", "slug": "photochromic-lenses", "brand": "LensCraft", "category_slug": "lenses", "description": "Automatically adjust to light conditions", "price": 1499, "original_price": 1999, "gender": "unisex", "image": "https://images.unsplash.com/photo-1608231397466-21516a8547f5?w=500", "rating": 4.8, "review_count": 289, "stock": 95, "tags": ["photochromic", "adaptive"], "is_new_arrival": True},
    {"name": "Anti-Glare Lenses", "slug": "anti-glare-lenses", "brand": "ClearVision", "category_slug": "lenses", "description": "Reduce glare and reflections", "price": 799, "original_price": 1099, "gender": "unisex", "image": "https://images.unsplash.com/photo-1608231397466-21516a8547f5?w=500", "rating": 4.6, "review_count": 356, "stock": 145, "tags": ["anti-glare"], "is_featured": False},
    
    # Number Glasses (Prescription)
    {"name": "Reading Glasses +1.5", "slug": "reading-glasses-1-5", "brand": "ReadWell", "category_slug": "number-glasses", "description": "Comfortable reading glasses", "price": 999, "original_price": 1499, "gender": "unisex", "image": "https://images.unsplash.com/photo-1572635196237-14b3f281503f?w=500", "rating": 4.5, "review_count": 234, "stock": 78, "tags": ["reading", "+1.5"], "is_featured": False},
    {"name": "Progressive Lenses Frame", "slug": "progressive-lenses-frame", "brand": "VisionPro", "category_slug": "number-glasses", "description": "Multi-focal progressive lenses", "price": 2999, "original_price": 3999, "gender": "unisex", "image": "https://images.unsplash.com/photo-1577803645773-f96470509666?w=500", "rating": 4.9, "review_count": 167, "stock": 42, "tags": ["progressive", "multifocal"], "is_featured": True},
    {"name": "High Index Thin Lenses", "slug": "high-index-thin-lenses", "brand": "ThinVision", "category_slug": "number-glasses", "description": "Ultra-thin high index lenses", "price": 2499, "original_price": 3299, "gender": "unisex", "image": "https://images.unsplash.com/photo-1511499767150-a48a237f0083?w=500", "rating": 4.7, "review_count": 198, "stock": 56, "tags": ["high-index", "thin"], "is_new_arrival": True},
    
    # Cases
    {"name": "Premium Leather Case", "slug": "premium-leather-case", "brand": "CaseGuard", "category_slug": "cases", "description": "Genuine leather protective case", "price": 599, "original_price": 899, "gender": "unisex", "image": "https://images.unsplash.com/photo-1608231397466-21516a8547f5?w=500", "rating": 4.6, "review_count": 445, "stock": 200, "tags": ["leather", "premium"], "is_featured": True},
    {"name": "Hard Shell Case", "slug": "hard-shell-case", "brand": "ProtectPro", "category_slug": "cases", "description": "Durable hard shell protection", "price": 399, "original_price": 599, "gender": "unisex", "image": "https://images.unsplash.com/photo-1608231397466-21516a8547f5?w=500", "rating": 4.5, "review_count": 523, "stock": 250, "tags": ["hard-shell", "durable"], "is_featured": False},
    {"name": "Microfiber Pouch", "slug": "microfiber-pouch", "brand": "SoftCase", "category_slug": "cases", "description": "Soft microfiber protective pouch", "price": 199, "original_price": 299, "gender": "unisex", "image": "https://images.unsplash.com/photo-1608231397466-21516a8547f5?w=500", "rating": 4.4, "review_count": 678, "stock": 350, "tags": ["microfiber", "soft"], "is_new_arrival": True},
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
