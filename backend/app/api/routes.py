from fastapi import APIRouter
from pydantic import BaseModel

router = APIRouter()

class QuestionRequest(BaseModel):
    question: str

@router.post("/ask")
def ask_question(request: QuestionRequest):
    return {
        "question": request.question,
        "answer": "This is a mock response to the question."
    }