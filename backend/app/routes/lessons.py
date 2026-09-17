from fastapi import APIRouter, HTTPException, Depends
from motor.motor_asyncio import AsyncIOMotorDatabase
from app.database.config import get_db
from app.schemas.lesson import LessonCreate, LessonResponse
from app.routes.auth import get_current_user
from bson import ObjectId

router = APIRouter()

@router.post("/", response_model=LessonResponse)
async def create_lesson(lesson: LessonCreate, current_user: dict = Depends(get_current_user), db: AsyncIOMotorDatabase = Depends(get_db)):
    if current_user["role"] != "teacher":
        raise HTTPException(status_code=403, detail="Only teachers can create lessons")
    
    lesson_dict = lesson.dict()
    lesson_dict["created_by"] = str(current_user["_id"])
    
    result = await db.lessons.insert_one(lesson_dict)
    
    return LessonResponse(
        id=str(result.inserted_id),
        **lesson_dict
    )

@router.get("/", response_model=list[LessonResponse])
async def get_lessons(current_user: dict = Depends(get_current_user), db: AsyncIOMotorDatabase = Depends(get_db)):
    if current_user["role"] == "teacher":
        cursor = db.lessons.find({"created_by": str(current_user["_id"])})
    else:
        # Students see all lessons for now, ideally filtered by class
        cursor = db.lessons.find()
    
    lessons = []
    async for doc in cursor:
        doc["id"] = str(doc["_id"])
        lessons.append(LessonResponse(**doc))
        
    return lessons

@router.get("/{id}", response_model=LessonResponse)
async def get_lesson(id: str, db: AsyncIOMotorDatabase = Depends(get_db)):
    lesson = await db.lessons.find_one({"_id": ObjectId(id)})
    if not lesson:
        raise HTTPException(status_code=404, detail="Lesson not found")
    lesson["id"] = str(lesson["_id"])
    return LessonResponse(**lesson)
