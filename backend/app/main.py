from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.routes import auth, lessons, translation, quizzes, progress, vocabulary
import uvicorn

app = FastAPI(title="TribalEdu AI API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(auth.router, prefix="/api/auth", tags=["auth"])
app.include_router(lessons.router, prefix="/api/lessons", tags=["lessons"])
app.include_router(translation.router, prefix="/api/translate", tags=["translation"])
app.include_router(quizzes.router, prefix="/api/quizzes", tags=["quizzes"])
app.include_router(progress.router, prefix="/api", tags=["progress"])
app.include_router(vocabulary.router, prefix="/api/vocabulary", tags=["vocabulary"])

@app.get("/")
def root():
    return {"message": "Welcome to TribalEdu AI API"}

if __name__ == "__main__":
    uvicorn.run("app.main:app", host="0.0.0.0", port=8000, reload=True)
