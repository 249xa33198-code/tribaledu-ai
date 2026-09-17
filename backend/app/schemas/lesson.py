from pydantic import BaseModel
from typing import List, Optional

class LessonContent(BaseModel):
    hindi: str
    santali: Optional[str] = None

class LessonCreate(BaseModel):
    title: str
    class_name: str
    subject: str
    chapter: str
    content: List[LessonContent]

class LessonResponse(LessonCreate):
    id: str
    created_by: str
