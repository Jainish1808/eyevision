"""
OAuth2 implementation for social login (Google, GitHub).
Uses Authorization Code Flow with PKCE and state parameter for security.
"""
import secrets
import httpx
from typing import Optional, Dict
from authlib.integrations.starlette_client import OAuth
from config import settings
from cryptography.fernet import Fernet
import base64


# Initialize OAuth client
oauth = OAuth()

# Register Google OAuth
if settings.GOOGLE_CLIENT_ID and settings.GOOGLE_CLIENT_SECRET:
    oauth.register(
        name='google',
        client_id=settings.GOOGLE_CLIENT_ID,
        client_secret=settings.GOOGLE_CLIENT_SECRET,
        server_metadata_url='https://accounts.google.com/.well-known/openid-configuration',
        client_kwargs={
            'scope': 'openid email profile',
            'prompt': 'select_account',
        }
    )

# Register GitHub OAuth
if settings.GITHUB_CLIENT_ID and settings.GITHUB_CLIENT_SECRET:
    oauth.register(
        name='github',
        client_id=settings.GITHUB_CLIENT_ID,
        client_secret=settings.GITHUB_CLIENT_SECRET,
        access_token_url='https://github.com/login/oauth/access_token',
        authorize_url='https://github.com/login/oauth/authorize',
        api_base_url='https://api.github.com/',
        client_kwargs={'scope': 'user:email'},
    )


class OAuthManager:
    """Manages OAuth2 flows and token encryption."""
    
    def __init__(self):
        # Initialize encryption for storing OAuth tokens
        if settings.ENCRYPTION_KEY:
            self.cipher = Fernet(settings.ENCRYPTION_KEY.encode())
        else:
            # Generate a key if not provided (for development only)
            key = Fernet.generate_key()
            self.cipher = Fernet(key)
    
    def generate_state(self) -> str:
        """Generate a cryptographically secure state parameter for OAuth."""
        return secrets.token_urlsafe(32)
    
    def generate_code_verifier(self) -> str:
        """Generate PKCE code verifier."""
        return secrets.token_urlsafe(32)
    
    def generate_code_challenge(self, verifier: str) -> str:
        """Generate PKCE code challenge from verifier."""
        import hashlib
        digest = hashlib.sha256(verifier.encode()).digest()
        return base64.urlsafe_b64encode(digest).decode().rstrip('=')
    
    def encrypt_token(self, token: str) -> str:
        """Encrypt OAuth token for storage in database."""
        return self.cipher.encrypt(token.encode()).decode()
    
    def decrypt_token(self, encrypted_token: str) -> str:
        """Decrypt OAuth token from database."""
        return self.cipher.decrypt(encrypted_token.encode()).decode()
    
    async def get_google_user_info(self, access_token: str) -> Optional[Dict]:
        """
        Get user info from Google using access token.
        
        Args:
            access_token: Google OAuth access token
        
        Returns:
            User info dict or None if failed
        """
        try:
            async with httpx.AsyncClient() as client:
                response = await client.get(
                    'https://www.googleapis.com/oauth2/v2/userinfo',
                    headers={'Authorization': f'Bearer {access_token}'},
                    timeout=10.0
                )
                
                if response.status_code == 200:
                    return response.json()
                
                return None
        except Exception:
            return None
    
    async def get_github_user_info(self, access_token: str) -> Optional[Dict]:
        """
        Get user info from GitHub using access token.
        
        Args:
            access_token: GitHub OAuth access token
        
        Returns:
            User info dict or None if failed
        """
        try:
            async with httpx.AsyncClient() as client:
                # Get user profile
                response = await client.get(
                    'https://api.github.com/user',
                    headers={
                        'Authorization': f'Bearer {access_token}',
                        'Accept': 'application/vnd.github.v3+json'
                    },
                    timeout=10.0
                )
                
                if response.status_code != 200:
                    return None
                
                user_data = response.json()
                
                # Get primary email if not public
                if not user_data.get('email'):
                    email_response = await client.get(
                        'https://api.github.com/user/emails',
                        headers={
                            'Authorization': f'Bearer {access_token}',
                            'Accept': 'application/vnd.github.v3+json'
                        },
                        timeout=10.0
                    )
                    
                    if email_response.status_code == 200:
                        emails = email_response.json()
                        primary_email = next(
                            (e['email'] for e in emails if e['primary']),
                            None
                        )
                        if primary_email:
                            user_data['email'] = primary_email
                
                return user_data
        except Exception:
            return None


# Global OAuth manager instance
oauth_manager = OAuthManager()
