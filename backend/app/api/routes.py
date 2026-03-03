from fastapi import APIRouter
from pydantic import BaseModel
from app.model.inference import get_response

router = APIRouter()

class QuestionRequest(BaseModel):
    question: str

@router.post("/ask")
def ask_question(request: QuestionRequest):
    try:
        answer = get_response(request.question)  # call the model
        return {
            "question": request.question,
            "answer": answer
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))