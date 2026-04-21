"""
Pydantic schemas for wishlist-related requests and responses.
"""
from pydantic import BaseModel
from typing import List
from datetime import datetime


class WishlistItemResponse(BaseModel):
    """Wishlist item response schema."""
    id: str
    product_id: str
    created_at: datetime
    product: "ProductResponse"

    class Config:
        from_attributes = True


class WishlistResponse(BaseModel):
    """Wishlist response schema."""
    items: List["WishlistItemResponse"]
    total: int
