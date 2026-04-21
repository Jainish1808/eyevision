"""
Redis connection manager for sessions, caching, and token blacklist.
Falls back to in-memory storage if Redis is unavailable.
"""
import redis.asyncio as redis
from typing import Optional
from config import settings
from app.core.inmemory_store import (
    get_in_memory_session,
    get_in_memory_cache,
    get_in_memory_blacklist
)


class RedisManager:
    """Manages Redis connections for different use cases."""
    
    def __init__(self):
        self._session_client: Optional[redis.Redis] = None
        self._cache_client: Optional[redis.Redis] = None
        self._blacklist_client: Optional[redis.Redis] = None
        self._use_inmemory = False

    async def get_session_client(self):
        """Get Redis client for session storage."""
        if self._use_inmemory:
            return get_in_memory_session()
        
        if not self._session_client:
            try:
                self._session_client = await redis.from_url(
                    settings.REDIS_URL,
                    db=settings.REDIS_SESSION_DB,
                    encoding="utf-8",
                    decode_responses=True
                )
                # Test connection
                await self._session_client.ping()
            except Exception as e:
                print(f"⚠️  Redis unavailable, using in-memory storage: {e}")
                self._use_inmemory = True
                return get_in_memory_session()
        return self._session_client

    async def get_cache_client(self):
        """Get Redis client for general caching."""
        if self._use_inmemory:
            return get_in_memory_cache()
        
        if not self._cache_client:
            try:
                self._cache_client = await redis.from_url(
                    settings.REDIS_URL,
                    db=settings.REDIS_CACHE_DB,
                    encoding="utf-8",
                    decode_responses=True
                )
                await self._cache_client.ping()
            except Exception as e:
                print(f"⚠️  Redis unavailable, using in-memory storage: {e}")
                self._use_inmemory = True
                return get_in_memory_cache()
        return self._cache_client

    async def get_blacklist_client(self):
        """Get Redis client for JWT blacklist (uses cache DB)."""
        if self._use_inmemory:
            return get_in_memory_blacklist()
        
        if not self._blacklist_client:
            try:
                self._blacklist_client = await redis.from_url(
                    settings.REDIS_URL,
                    db=settings.REDIS_CACHE_DB,
                    encoding="utf-8",
                    decode_responses=True
                )
                await self._blacklist_client.ping()
            except Exception as e:
                print(f"⚠️  Redis unavailable, using in-memory storage: {e}")
                self._use_inmemory = True
                return get_in_memory_blacklist()
        return self._blacklist_client

    async def close_all(self):
        """Close all Redis connections."""
        if self._session_client and not self._use_inmemory:
            await self._session_client.close()
        if self._cache_client and not self._use_inmemory:
            await self._cache_client.close()
        if self._blacklist_client and not self._use_inmemory:
            await self._blacklist_client.close()


# Global Redis manager instance
redis_manager = RedisManager()


async def get_redis_session():
    """Dependency to get Redis session client."""
    return await redis_manager.get_session_client()


async def get_redis_cache():
    """Dependency to get Redis cache client."""
    return await redis_manager.get_cache_client()


async def get_redis_blacklist():
    """Dependency to get Redis blacklist client."""
    return await redis_manager.get_blacklist_client()
