"""
In-memory storage fallback for development without Redis.
WARNING: This is for development only. Use Redis in production.
"""
from typing import Optional, Dict
from datetime import datetime, timedelta
import asyncio


class InMemoryStore:
    """
    In-memory key-value store that mimics Redis interface.
    Data is lost on server restart - use Redis in production.
    """
    
    def __init__(self):
        self._store: Dict[str, tuple[str, Optional[datetime]]] = {}
        self._lock = asyncio.Lock()
        # Start cleanup task
        asyncio.create_task(self._cleanup_expired())
    
    async def setex(self, key: str, seconds: int, value: str):
        """Set key with expiration time in seconds."""
        async with self._lock:
            expiry = datetime.utcnow() + timedelta(seconds=seconds)
            self._store[key] = (value, expiry)
    
    async def get(self, key: str) -> Optional[str]:
        """Get value by key."""
        async with self._lock:
            if key not in self._store:
                return None
            
            value, expiry = self._store[key]
            
            # Check if expired
            if expiry and datetime.utcnow() > expiry:
                del self._store[key]
                return None
            
            return value
    
    async def exists(self, key: str) -> int:
        """Check if key exists."""
        value = await self.get(key)
        return 1 if value is not None else 0
    
    async def delete(self, *keys: str):
        """Delete one or more keys."""
        async with self._lock:
            for key in keys:
                self._store.pop(key, None)
    
    async def scan(self, cursor: int, match: str = None, count: int = 100):
        """Scan keys matching pattern."""
        async with self._lock:
            keys = list(self._store.keys())
            
            # Simple pattern matching
            if match:
                pattern = match.replace('*', '')
                keys = [k for k in keys if pattern in k]
            
            # Return cursor and keys
            return (0, keys[:count])
    
    async def close(self):
        """Close connection (no-op for in-memory)."""
        pass
    
    async def _cleanup_expired(self):
        """Background task to clean up expired keys."""
        while True:
            try:
                await asyncio.sleep(60)  # Run every minute
                async with self._lock:
                    now = datetime.utcnow()
                    expired_keys = [
                        key for key, (_, expiry) in self._store.items()
                        if expiry and now > expiry
                    ]
                    for key in expired_keys:
                        del self._store[key]
            except Exception:
                pass


# Global in-memory stores
_session_store = None
_cache_store = None
_blacklist_store = None


def get_in_memory_session():
    """Get in-memory session store."""
    global _session_store
    if _session_store is None:
        _session_store = InMemoryStore()
    return _session_store


def get_in_memory_cache():
    """Get in-memory cache store."""
    global _cache_store
    if _cache_store is None:
        _cache_store = InMemoryStore()
    return _cache_store


def get_in_memory_blacklist():
    """Get in-memory blacklist store."""
    global _blacklist_store
    if _blacklist_store is None:
        _blacklist_store = InMemoryStore()
    return _blacklist_store
