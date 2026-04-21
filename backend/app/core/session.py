"""
Redis-backed session management with security features.
Includes session fingerprinting, idle timeout, and absolute timeout.
"""
import json
from datetime import datetime, timedelta
from typing import Optional, Dict
from fastapi import Request
import redis.asyncio as redis
from config import settings
from app.core.security import generate_session_id


class SessionManager:
    """Manages user sessions with Redis backend."""
    
    def __init__(self, redis_client: redis.Redis):
        self.redis = redis_client

    def _get_session_key(self, session_id: str) -> str:
        """Get Redis key for session."""
        return f"session:{session_id}"

    def _create_fingerprint(self, request: Request) -> str:
        """
        Create session fingerprint from user-agent and IP.
        Used for anomaly detection.
        """
        user_agent = request.headers.get("user-agent", "")
        ip_address = request.client.host if request.client else ""
        return f"{user_agent}|{ip_address}"

    async def create_session(
        self,
        user_id: str,
        request: Request,
        data: Optional[Dict] = None
    ) -> str:
        """
        Create a new session.
        
        Args:
            user_id: User ID
            request: FastAPI request object
            data: Additional session data
        
        Returns:
            Session ID
        """
        session_id = generate_session_id()
        now = datetime.utcnow()
        
        session_data = {
            "user_id": user_id,
            "created_at": now.isoformat(),
            "last_activity": now.isoformat(),
            "fingerprint": self._create_fingerprint(request),
            "data": data or {}
        }
        
        # Store in Redis with max age TTL
        await self.redis.setex(
            self._get_session_key(session_id),
            settings.SESSION_MAX_AGE,
            json.dumps(session_data)
        )
        
        return session_id

    async def get_session(self, session_id: str, request: Request) -> Optional[Dict]:
        """
        Get session data and validate.
        
        Args:
            session_id: Session ID
            request: FastAPI request object
        
        Returns:
            Session data or None if invalid/expired
        """
        session_json = await self.redis.get(self._get_session_key(session_id))
        if not session_json:
            return None
        
        session_data = json.loads(session_json)
        
        # Validate fingerprint for anomaly detection
        current_fingerprint = self._create_fingerprint(request)
        if session_data.get("fingerprint") != current_fingerprint:
            # Fingerprint mismatch - possible session hijacking
            await self.delete_session(session_id)
            return None
        
        # Check idle timeout
        last_activity = datetime.fromisoformat(session_data["last_activity"])
        if (datetime.utcnow() - last_activity).total_seconds() > settings.SESSION_IDLE_TIMEOUT:
            await self.delete_session(session_id)
            return None
        
        # Check absolute timeout
        created_at = datetime.fromisoformat(session_data["created_at"])
        if (datetime.utcnow() - created_at).total_seconds() > settings.SESSION_ABSOLUTE_TIMEOUT:
            await self.delete_session(session_id)
            return None
        
        # Update last activity
        session_data["last_activity"] = datetime.utcnow().isoformat()
        await self.redis.setex(
            self._get_session_key(session_id),
            settings.SESSION_MAX_AGE,
            json.dumps(session_data)
        )
        
        return session_data

    async def update_session(self, session_id: str, data: Dict):
        """
        Update session data.
        
        Args:
            session_id: Session ID
            data: Data to merge into session
        """
        session_json = await self.redis.get(self._get_session_key(session_id))
        if not session_json:
            return
        
        session_data = json.loads(session_json)
        session_data["data"].update(data)
        session_data["last_activity"] = datetime.utcnow().isoformat()
        
        await self.redis.setex(
            self._get_session_key(session_id),
            settings.SESSION_MAX_AGE,
            json.dumps(session_data)
        )

    async def delete_session(self, session_id: str):
        """Delete a session."""
        await self.redis.delete(self._get_session_key(session_id))

    async def delete_all_user_sessions(self, user_id: str):
        """Delete all sessions for a user."""
        # Scan for all session keys
        cursor = 0
        while True:
            cursor, keys = await self.redis.scan(
                cursor,
                match="session:*",
                count=100
            )
            
            for key in keys:
                session_json = await self.redis.get(key)
                if session_json:
                    session_data = json.loads(session_json)
                    if session_data.get("user_id") == user_id:
                        await self.redis.delete(key)
            
            if cursor == 0:
                break
