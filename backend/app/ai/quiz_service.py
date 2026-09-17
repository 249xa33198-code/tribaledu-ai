import random

class QuizService:
    def generate_quiz(self, lesson_content: str):
        """
        Mock AI Quiz Generation.
        In production, this would call an LLM (like Gemini or HF) with the lesson content.
        """
        # Fallback question bank
        questions = [
            {
                "question": "What do plants need to grow?",
                "options": ["Water and Sunlight", "Plastic", "Metal", "Smoke"],
                "correct_answer": "Water and Sunlight",
                "explanation": "Plants use water and sunlight for photosynthesis."
            },
            {
                "question": "Which of these is a tribal language?",
                "options": ["Santali", "French", "German", "Spanish"],
                "correct_answer": "Santali",
                "explanation": "Santali is spoken by the Santal tribal community."
            }
        ]
        return questions

    def evaluate_answer(self, user_answers: list, correct_answers: list):
        score = 0
        for u, c in zip(user_answers, correct_answers):
            if u == c:
                score += 1
        return score
