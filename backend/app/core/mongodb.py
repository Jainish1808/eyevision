"""
MongoDB connection helpers.
"""
from functools import lru_cache
from pymongo import MongoClient
from pymongo.database import Database
from config import settings


@lru_cache()
def get_client() -> MongoClient:
    return MongoClient(settings.MONGODB_URL)


@lru_cache()
def get_mongo_db() -> Database:
    return get_client()[settings.MONGODB_DB_NAME]


def get_db() -> Database:
    return get_mongo_db()
