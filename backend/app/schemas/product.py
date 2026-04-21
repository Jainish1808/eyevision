"""
Pydantic schemas for product-related requests and responses.
"""
from pydantic import BaseModel, Field
from typing import Optional, List, Dict, Any
from datetime import datetime


# ---------- Product Schemas ----------
class ProductBase(BaseModel):
    """Base product schema."""
    name: str = Field(..., min_length=1, max_length=255)
    slug: str
    brand: str
    description: Optional[str] = None
    category_id: str
    gender: str = "unisex"
    price: float
    original_price: Optional[float] = None
    currency: str = "INR"
    sku: Optional[str] = None
    specs: Optional[Dict[str, str]] = None
    variants: Optional[Dict[str, Any]] = None
    tags: Optional[List[str]] = None
    is_active: bool = True
    is_featured: bool = False
    is_new_arrival: bool = False


class ProductCreate(ProductBase):
    """Product creation schema."""
    pass


class ProductUpdate(BaseModel):
    """Product update schema."""
    name: Optional[str] = None
    description: Optional[str] = None
    price: Optional[float] = None
    original_price: Optional[float] = None
    stock_quantity: Optional[int] = None
    is_active: Optional[bool] = None
    is_featured: Optional[bool] = None
    tags: Optional[List[str]] = None


class ProductImageBase(BaseModel):
    """Base product image schema."""
    url: str
    alt_text: Optional[str] = None
    display_order: int = 0


class ProductResponse(ProductBase):
    """Product response schema."""
    id: str
    primary_image: Optional[str] = None
    rating: float = 0.0
    review_count: int = 0
    stock_quantity: int = 0
    low_stock_threshold: int = 10
    images: List[ProductImageBase] = []
    created_at: datetime
    updated_at: Optional[datetime] = None

    class Config:
        from_attributes = True


class ProductListResponse(BaseModel):
    """Paginated product list response."""
    products: List[ProductResponse]
    total: int
    page: int
    limit: int
    totalPages: int


# ---------- Category Schemas ----------
class CategoryBase(BaseModel):
    """Base category schema."""
    name: str = Field(..., min_length=1, max_length=100)
    slug: str
    description: Optional[str] = None
    icon: Optional[str] = None
    parent_id: Optional[str] = None
    display_order: int = 0
    is_active: bool = True


class CategoryCreate(CategoryBase):
    """Category creation schema."""
    pass


class CategoryUpdate(BaseModel):
    """Category update schema."""
    name: Optional[str] = None
    description: Optional[str] = None
    icon: Optional[str] = None
    display_order: Optional[int] = None
    is_active: Optional[bool] = None


class CategoryResponse(CategoryBase):
    """Category response schema."""
    id: str
    created_at: datetime
    updated_at: Optional[datetime] = None

    class Config:
        from_attributes = True


class CategoryWithCount(CategoryResponse):
    """Category with product count."""
    product_count: int = 0


# ---------- Filter Schemas ----------
class ProductFilters(BaseModel):
    """Product filter parameters."""
    category: Optional[str] = None
    brand: Optional[str] = None
    min_price: Optional[float] = None
    max_price: Optional[float] = None
    color: Optional[str] = None
    size: Optional[str] = None
    gender: Optional[str] = None
    rating: Optional[float] = None
    sort: str = "newest"
    page: int = 1
    limit: int = 20
    search: Optional[str] = None
