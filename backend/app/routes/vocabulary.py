from fastapi import APIRouter, HTTPException, Depends
from motor.motor_asyncio import AsyncIOMotorDatabase
from app.database.config import get_db
from app.routes.auth import get_current_user
import json
import os
from pydantic import BaseModel

router = APIRouter()

class VocabularyItem(BaseModel):
    hindi: str
    santali: str
    english: str

@router.get("/")
async def get_vocabulary():
    vocab_path = os.path.join(os.path.dirname(__file__), "../../../data/vocabulary.json")
    try:
        with open(vocab_path, "r", encoding="utf-8") as f:
            return json.load(f)
    except Exception as e:
        return []

@router.post("/")
async def add_vocabulary(item: VocabularyItem, current_user: dict = Depends(get_current_user)):
    if current_user["role"] != "admin":
        raise HTTPException(status_code=403, detail="Only admins can add to the verified vocabulary")
        
    vocab_path = os.path.join(os.path.dirname(__file__), "../../../data/vocabulary.json")
    vocab = []
    if os.path.exists(vocab_path):
        with open(vocab_path, "r", encoding="utf-8") as f:
            vocab = json.load(f)
            
    vocab.append(item.dict())
    
    with open(vocab_path, "w", encoding="utf-8") as f:
        json.dump(vocab, f, ensure_ascii=False, indent=2)
        
    return {"message": "Vocabulary added successfully"}
