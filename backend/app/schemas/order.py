"""
Pydantic schemas for order-related requests and responses.
"""
from pydantic import BaseModel, Field
from typing import Optional, Dict, Any, List
from datetime import datetime
from app.models.order import OrderStatus, PaymentStatus, PaymentMethod


# ---------- Order Schemas ----------
class OrderItemCreate(BaseModel):
    """Order item creation schema."""
    product_id: str
    quantity: int = 1
    variant: Optional[Dict[str, Any]] = None
    prescription: Optional[Dict[str, str]] = None


class OrderCreate(BaseModel):
    """Order creation schema."""
    shipping_address: Dict[str, Any]
    billing_address: Optional[Dict[str, Any]] = None
    payment_method: str = "card"
    customer_notes: Optional[str] = None


class OrderUpdate(BaseModel):
    """Order update schema."""
    status: Optional[OrderStatus] = None
    payment_status: Optional[PaymentStatus] = None
    tracking_number: Optional[str] = None
    courier_partner: Optional[str] = None
    internal_notes: Optional[str] = None


class OrderItemResponse(BaseModel):
    """Order item response schema."""
    id: str
    product_id: str
    product_name: str
    product_slug: str
    product_image: Optional[str] = None
    quantity: int
    unit_price: float
    total_price: float
    variant: Optional[Dict[str, Any]] = None
    created_at: datetime

    class Config:
        from_attributes = True


class OrderResponse(BaseModel):
    """Order response schema."""
    id: str
    order_number: str
    user_id: str
    status: str
    payment_status: str
    payment_method: Optional[str] = None
    subtotal: float
    tax_amount: float
    shipping_amount: float
    discount_amount: float
    total_amount: float
    shipping_address: Optional[Dict[str, Any]] = None
    billing_address: Optional[Dict[str, Any]] = None
    tracking_number: Optional[str] = None
    courier_partner: Optional[str] = None
    customer_notes: Optional[str] = None
    items: List["OrderItemResponse"]
    created_at: datetime
    updated_at: Optional[datetime] = None
    shipped_at: Optional[datetime] = None
    delivered_at: Optional[datetime] = None

    class Config:
        from_attributes = True


class OrderListResponse(BaseModel):
    """Paginated order list response."""
    orders: List[OrderResponse]
    total: int
    page: int
    limit: int
    totalPages: int
