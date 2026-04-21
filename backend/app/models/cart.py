"""
Cart and CartItem models for shopping cart functionality.
"""
from sqlalchemy import Column, String, Integer, Float, ForeignKey, Text, DateTime
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
from app.core.database import Base
import uuid


class Cart(Base):
    """Shopping cart model - one per user."""

    __tablename__ = "carts"

    id = Column(String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    user_id = Column(String(36), ForeignKey("users.id"), unique=True, nullable=False)

    # Timestamps
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())

    # Relationships
    user = relationship("User", back_populates="cart")
    items = relationship("CartItem", back_populates="cart", cascade="all, delete-orphan")

    @property
    def total_amount(self) -> float:
        """Calculate total cart amount."""
        return sum(item.subtotal for item in self.items)

    @property
    def total_items(self) -> int:
        """Calculate total number of items in cart."""
        return sum(item.quantity for item in self.items)

    def __repr__(self) -> str:
        return f"<Cart(id={self.id}, user_id={self.user_id})>"


class CartItem(Base):
    """Individual item in a shopping cart."""

    __tablename__ = "cart_items"

    id = Column(String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    cart_id = Column(String(36), ForeignKey("carts.id"), nullable=False)
    product_id = Column(String(36), ForeignKey("products.id"), nullable=False)

    # Quantity
    quantity = Column(Integer, nullable=False, default=1)

    # Selected variant details (stored as JSON string)
    # Example: {"color": "Black", "size": "Medium", "lensType": "Clear"}
    variant = Column(Text, nullable=True)

    # Prescription details (stored as JSON string)
    # Example: {"sph_left": "-2.00", "sph_right": "-2.00", "cyl_left": "-0.50"}
    prescription = Column(Text, nullable=True)

    # Timestamps
    added_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())

    # Relationships
    cart = relationship("Cart", back_populates="items")
    product = relationship("Product", back_populates="cart_items")

    @property
    def subtotal(self) -> float:
        """Calculate subtotal for this item."""
        if self.product:
            return self.product.price * self.quantity
        return 0.0

    def __repr__(self) -> str:
        return f"<CartItem(id={self.id}, product_id={self.product_id}, quantity={self.quantity})>"
