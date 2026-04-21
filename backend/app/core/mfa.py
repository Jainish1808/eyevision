"""
Multi-Factor Authentication (MFA) using TOTP.
Compatible with Google Authenticator, Authy, etc.
"""
import pyotp
import qrcode
import io
import base64
import secrets
from typing import List, Tuple
from config import settings
from app.core.security import get_password_hash, verify_password


def generate_totp_secret() -> str:
    """Generate a random TOTP secret (base32 encoded)."""
    return pyotp.random_base32()


def generate_totp_uri(secret: str, user_email: str) -> str:
    """
    Generate TOTP provisioning URI for QR code.
    
    Args:
        secret: TOTP secret
        user_email: User's email address
    
    Returns:
        Provisioning URI string
    """
    return pyotp.totp.TOTP(secret).provisioning_uri(
        name=user_email,
        issuer_name=settings.MFA_ISSUER_NAME
    )


def generate_qr_code(uri: str) -> str:
    """
    Generate QR code image as base64 string.
    
    Args:
        uri: TOTP provisioning URI
    
    Returns:
        Base64 encoded PNG image
    """
    qr = qrcode.QRCode(version=1, box_size=10, border=5)
    qr.add_data(uri)
    qr.make(fit=True)
    
    img = qr.make_image(fill_color="black", back_color="white")
    
    # Convert to base64
    buffer = io.BytesIO()
    img.save(buffer, format="PNG")
    buffer.seek(0)
    img_base64 = base64.b64encode(buffer.getvalue()).decode()
    
    return f"data:image/png;base64,{img_base64}"


def verify_totp_code(secret: str, code: str) -> bool:
    """
    Verify a TOTP code.
    
    Args:
        secret: TOTP secret
        code: 6-digit code from authenticator app
    
    Returns:
        True if valid, False otherwise
    """
    totp = pyotp.TOTP(secret)
    # Allow 1 time step before and after for clock skew (30 second window each)
    return totp.verify(code, valid_window=1)


def generate_backup_codes(count: int = 10) -> List[Tuple[str, str]]:
    """
    Generate backup codes for MFA recovery.
    
    Args:
        count: Number of backup codes to generate
    
    Returns:
        List of (plain_code, hashed_code) tuples
    """
    codes = []
    for _ in range(count):
        # Generate 8-character alphanumeric code
        code = secrets.token_hex(4).upper()
        # Format as XXXX-XXXX for readability
        formatted_code = f"{code[:4]}-{code[4:]}"
        hashed_code = get_password_hash(formatted_code)
        codes.append((formatted_code, hashed_code))
    
    return codes


def verify_backup_code(plain_code: str, hashed_code: str) -> bool:
    """
    Verify a backup code.
    
    Args:
        plain_code: Plain text backup code
        hashed_code: Hashed backup code from database
    
    Returns:
        True if valid, False otherwise
    """
    return verify_password(plain_code, hashed_code)
