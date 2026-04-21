"""
Role-Based Access Control (RBAC) system.
Defines roles, permissions, and access control logic.
"""
from enum import Enum
from typing import List, Set


class Role(str, Enum):
    """User roles in the system."""
    ADMIN = "admin"
    MODERATOR = "moderator"
    USER = "user"
    GUEST = "guest"


class Permission(str, Enum):
    """Granular permissions in the system."""
    # User management
    USER_READ = "user:read"
    USER_WRITE = "user:write"
    USER_DELETE = "user:delete"
    
    # Product management
    PRODUCT_READ = "product:read"
    PRODUCT_WRITE = "product:write"
    PRODUCT_DELETE = "product:delete"
    
    # Order management
    ORDER_READ = "order:read"
    ORDER_WRITE = "order:write"
    ORDER_MANAGE = "order:manage"
    
    # System administration
    SYSTEM_ADMIN = "system:admin"
    AUDIT_LOG_READ = "audit:read"


# Role to permissions mapping
ROLE_PERMISSIONS: dict[Role, Set[Permission]] = {
    Role.ADMIN: {
        # Full access to everything
        Permission.USER_READ,
        Permission.USER_WRITE,
        Permission.USER_DELETE,
        Permission.PRODUCT_READ,
        Permission.PRODUCT_WRITE,
        Permission.PRODUCT_DELETE,
        Permission.ORDER_READ,
        Permission.ORDER_WRITE,
        Permission.ORDER_MANAGE,
        Permission.SYSTEM_ADMIN,
        Permission.AUDIT_LOG_READ,
    },
    Role.MODERATOR: {
        # Can manage products and view orders
        Permission.USER_READ,
        Permission.PRODUCT_READ,
        Permission.PRODUCT_WRITE,
        Permission.ORDER_READ,
        Permission.ORDER_MANAGE,
    },
    Role.USER: {
        # Can read products and manage own orders
        Permission.PRODUCT_READ,
        Permission.ORDER_READ,
        Permission.ORDER_WRITE,
    },
    Role.GUEST: {
        # Can only read products
        Permission.PRODUCT_READ,
    },
}


def get_role_permissions(role: Role) -> Set[Permission]:
    """Get all permissions for a given role."""
    return ROLE_PERMISSIONS.get(role, set())


def has_permission(user_role: Role, required_permission: Permission) -> bool:
    """Check if a role has a specific permission."""
    return required_permission in get_role_permissions(user_role)


def has_any_permission(user_role: Role, required_permissions: List[Permission]) -> bool:
    """Check if a role has any of the required permissions."""
    role_perms = get_role_permissions(user_role)
    return any(perm in role_perms for perm in required_permissions)


def has_all_permissions(user_role: Role, required_permissions: List[Permission]) -> bool:
    """Check if a role has all of the required permissions."""
    role_perms = get_role_permissions(user_role)
    return all(perm in role_perms for perm in required_permissions)
