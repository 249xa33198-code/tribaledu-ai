from fastapi import APIRouter, HTTPException, Depends
from motor.motor_asyncio import AsyncIOMotorDatabase
from app.database.config import get_db
from app.routes.auth import get_current_user

router = APIRouter()

@router.get("/progress")
async def get_my_progress(current_user: dict = Depends(get_current_user), db: AsyncIOMotorDatabase = Depends(get_db)):
    if current_user["role"] != "student":
        raise HTTPException(status_code=403, detail="Only students can access their progress directly")
        
    student_id = str(current_user["_id"])
    
    results_cursor = db.quiz_results.find({"student_id": student_id})
    
    total_score = 0
    total_quizzes = 0
    lessons_completed = set()
    
    async for result in results_cursor:
        total_quizzes += 1
        total_score += (result["score"] / result["total"]) * 100 if result["total"] > 0 else 0
        lessons_completed.add(result["lesson_id"])
        
    avg_score = total_score / total_quizzes if total_quizzes > 0 else 0
    
    return {
        "lessons_completed": len(lessons_completed),
        "quiz_average": round(avg_score, 2),
        "learning_streak": 1, # Mock value for now
        "topics_completed": len(lessons_completed) # Mock mapping
    }

@router.get("/students/{id}/progress")
async def get_student_progress(id: str, current_user: dict = Depends(get_current_user), db: AsyncIOMotorDatabase = Depends(get_db)):
    if current_user["role"] != "teacher":
        raise HTTPException(status_code=403, detail="Only teachers can view other students' progress")
        
    results_cursor = db.quiz_results.find({"student_id": id})
    
    total_score = 0
    total_quizzes = 0
    lessons_completed = set()
    
    async for result in results_cursor:
        total_quizzes += 1
        total_score += (result["score"] / result["total"]) * 100 if result["total"] > 0 else 0
        lessons_completed.add(result["lesson_id"])
        
    avg_score = total_score / total_quizzes if total_quizzes > 0 else 0
    
    return {
        "student_id": id,
        "lessons_completed": len(lessons_completed),
        "quiz_average": round(avg_score, 2)
    }

@router.get("/analytics")
async def get_analytics(current_user: dict = Depends(get_current_user), db: AsyncIOMotorDatabase = Depends(get_db)):
    if current_user["role"] != "teacher":
        raise HTTPException(status_code=403, detail="Only teachers can view analytics")
        
    # Mocking advanced analytics due to lack of aggregation pipeline on mock db
    total_students = await db.users.count_documents({"role": "student"})
    total_lessons = await db.lessons.count_documents({})
    
    return {
        "total_students": total_students,
        "lessons_created": total_lessons,
        "average_student_score": 85,
        "insights": "Students are performing better in lessons with bilingual explanations."
    }
