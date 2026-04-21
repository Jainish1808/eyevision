"""
Pydantic schemas for cart-related requests and responses.
"""
from pydantic import BaseModel
from typing import Optional, Dict, Any, List
from datetime import datetime


# ---------- Cart Schemas ----------
class CartItemCreate(BaseModel):
    """Add item to cart schema."""
    product_id: str
    quantity: int = 1
    variant: Optional[Dict[str, Any]] = None
    prescription: Optional[Dict[str, str]] = None


class CartItemUpdate(BaseModel):
    """Update cart item schema."""
    quantity: int


class CartItemResponse(BaseModel):
    """Cart item response schema."""
    id: str
    product_id: str
    quantity: int
    variant: Optional[Dict[str, Any]] = None
    prescription: Optional[Dict[str, str]] = None
    product: Optional["ProductResponse"] = None
    added_at: datetime

    class Config:
        from_attributes = True


class CartResponse(BaseModel):
    """Cart response schema."""
    id: str
    user_id: str
    items: List["CartItemResponse"]
    total_amount: float
    total_items: int
    created_at: datetime
    updated_at: Optional[datetime] = None

    class Config:
        from_attributes = True
