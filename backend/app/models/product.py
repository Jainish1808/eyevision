"""
Product and Category models for the e-commerce store.
"""
from sqlalchemy import Column, String, Integer, Float, ForeignKey, Text, Boolean, Table, DateTime
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
from app.core.database import Base
from typing import Optional
import uuid


# Association table for product images (many-to-many)
product_images = Table(
    "product_image_links",
    Base.metadata,
    Column("product_id", String(36), ForeignKey("products.id"), primary_key=True),
    Column("image_id", String(36), ForeignKey("product_images.id"), primary_key=True),
)


class ProductImage(Base):
    """Product image model."""

    __tablename__ = "product_images"

    id = Column(String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    url = Column(Text, nullable=False)
    alt_text = Column(String(255), nullable=True)
    display_order = Column(Integer, default=0)
    created_at = Column(DateTime(timezone=True), server_default=func.now())


class Category(Base):
    """Category model for product categorization."""

    __tablename__ = "categories"

    id = Column(String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    name = Column(String(100), unique=True, nullable=False)
    slug = Column(String(100), unique=True, nullable=False)
    description = Column(Text, nullable=True)
    icon = Column(String(255), nullable=True)  # Icon URL or name
    parent_id = Column(String(36), ForeignKey("categories.id"), nullable=True)
    display_order = Column(Integer, default=0)
    is_active = Column(Boolean, default=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())

    # Relationships
    parent = relationship("Category", remote_side=[id], backref="subcategories")
    products = relationship("Product", back_populates="category")

    def __repr__(self) -> str:
        return f"<Category(id={self.id}, name={self.name})>"


class Product(Base):
    """Product model for eyewear items."""

    __tablename__ = "products"

    # Basic Info
    id = Column(String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    name = Column(String(255), nullable=False)
    slug = Column(String(255), unique=True, nullable=False, index=True)
    brand = Column(String(100), nullable=False)
    description = Column(Text, nullable=True)

    # Categorization
    category_id = Column(String(36), ForeignKey("categories.id"), nullable=False)
    category = relationship("Category", back_populates="products")
    gender = Column(String(20), default="unisex")  # men, women, unisex

    # Pricing
    price = Column(Float, nullable=False)
    original_price = Column(Float, nullable=True)  # For showing discounts
    currency = Column(String(3), default="INR")

    # Inventory
    sku = Column(String(100), unique=True, nullable=True)
    stock_quantity = Column(Integer, default=0)
    low_stock_threshold = Column(Integer, default=10)

    # Media
    primary_image = Column(Text, nullable=True)  # Main product image URL
    images = relationship("ProductImage", secondary=product_images, cascade="all")

    # Specifications (stored as JSON string)
    # Example: {"frame_width": "140mm", "lens_width": "52mm", "bridge": "18mm", "temple": "140mm"}
    specs = Column(Text, nullable=True)

    # Variants (stored as JSON string)
    # Example: {"colors": ["Black", "Brown"], "sizes": ["Medium", "Large"], "lensTypes": ["Clear", "Sun"]}
    variants = Column(Text, nullable=True)

    # Ratings
    rating = Column(Float, default=0.0)
    review_count = Column(Integer, default=0)

    # Status
    is_active = Column(Boolean, default=True)
    is_featured = Column(Boolean, default=False)
    is_new_arrival = Column(Boolean, default=False)
    tags = Column(Text, nullable=True)  # Comma-separated tags

    # Timestamps
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())

    # Relationships
    order_items = relationship("OrderItem", back_populates="product")
    cart_items = relationship("CartItem", back_populates="product")
    wishlist_items = relationship("WishlistItem", back_populates="product")

    @property
    def discount_percentage(self) -> Optional[float]:
        """Calculate discount percentage if original price exists."""
        if self.original_price and self.original_price > self.price:
            return round(((self.original_price - self.price) / self.original_price) * 100, 2)
        return None

    def __repr__(self) -> str:
        return f"<Product(id={self.id}, name={self.name})>"
