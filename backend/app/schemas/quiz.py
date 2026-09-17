from pydantic import BaseModel
from typing import List, Optional

class Question(BaseModel):
    question: str
    options: List[str]
    correct_answer: str
    explanation: str

class QuizCreate(BaseModel):
    lesson_id: str
    questions: List[Question]

class QuizSubmit(BaseModel):
    answers: List[str]

