from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from typing import List
from app.model.inference import get_response

router = APIRouter()

class ChatMessage(BaseModel):
    role: str   # "user" or "bot"
    text: str

class QuestionRequest(BaseModel):
    question: str
    history: List[ChatMessage] = []  # empty list if no history yet

@router.post("/ask")
def ask_question(request: QuestionRequest):
    try:
        answer = get_response(request.question, request.history)
        return {
            "question": request.question,
            "answer": answer
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))