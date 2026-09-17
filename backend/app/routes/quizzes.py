from fastapi import APIRouter, HTTPException, Depends
from motor.motor_asyncio import AsyncIOMotorDatabase
from app.database.config import get_db
from app.schemas.quiz import QuizCreate, QuizSubmit
from app.routes.auth import get_current_user
from app.ai.quiz_service import QuizService
from bson import ObjectId
import datetime

router = APIRouter()
quiz_service = QuizService()

@router.post("/generate")
async def generate_quiz(lesson_id: str, db: AsyncIOMotorDatabase = Depends(get_db)):
    lesson = await db.lessons.find_one({"_id": ObjectId(lesson_id)})
    if not lesson:
        raise HTTPException(status_code=404, detail="Lesson not found")
    
    content = " ".join([c["hindi"] for c in lesson.get("content", [])])
    questions = quiz_service.generate_quiz(content)
    
    quiz_data = {
        "lesson_id": lesson_id,
        "questions": questions
    }
    result = await db.quizzes.insert_one(quiz_data)
    
    return {"id": str(result.inserted_id), "questions": questions}

@router.post("/{quiz_id}/submit")
async def submit_quiz(quiz_id: str, submission: QuizSubmit, current_user: dict = Depends(get_current_user), db: AsyncIOMotorDatabase = Depends(get_db)):
    if current_user["role"] != "student":
        raise HTTPException(status_code=403, detail="Only students can submit quizzes")
        
    quiz = await db.quizzes.find_one({"_id": ObjectId(quiz_id)})
    if not quiz:
        raise HTTPException(status_code=404, detail="Quiz not found")
        
    correct_answers = [q["correct_answer"] for q in quiz["questions"]]
    score = quiz_service.evaluate_answer(submission.answers, correct_answers)
    
    result_data = {
        "student_id": str(current_user["_id"]),
        "quiz_id": quiz_id,
        "lesson_id": quiz["lesson_id"],
        "score": score,
        "total": len(correct_answers),
        "date": datetime.datetime.utcnow()
    }
    
    await db.quiz_results.insert_one(result_data)
    
    return {"score": score, "total": len(correct_answers)}
