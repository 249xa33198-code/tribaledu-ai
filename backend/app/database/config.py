import os
from motor.motor_asyncio import AsyncIOMotorClient
from dotenv import load_dotenv

load_dotenv()

MONGODB_URI = os.getenv("MONGODB_URI", "mongodb://localhost:27017/tribaledu")
USE_MOCK = os.getenv("MOCK_DB", "true").lower() == "true"

if USE_MOCK:
    from mongomock_motor import AsyncMongoMockClient
    client = AsyncMongoMockClient()
else:
    client = AsyncIOMotorClient(MONGODB_URI)

def get_db():
    return client.get_database("tribaledu")

