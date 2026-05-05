# app/api/routes.py
from fastapi import APIRouter, HTTPException, Request, Depends
from pydantic import BaseModel
from typing import List
from sqlalchemy.orm import Session
from app.model.inference import get_response
from app.database.connection import get_db
from app.database.models import User, ChatSession, Message
from app.auth.utils import get_optional_user

router = APIRouter()

class ChatMessage(BaseModel):
    role: str
    text: str

class QuestionRequest(BaseModel):
    question: str
    history: List[ChatMessage] = []
    session_id: int | None = None
    model_id: str = "gemma3"          

@router.post("/ask")
def ask_question(
    request: Request,
    body: QuestionRequest,
    db: Session = Depends(get_db)
):
    
    # Get data from the json
    # Basedon the data use a different function
    # get answer from model regardless of auth
    answer = get_response(body.question, body.history, model=body.model_id)
    
    # try to identify user from token
    username = get_optional_user(request, db)
    
    if username:
        # user is logged in — save to database
        user = db.query(User).filter(User.username == username).first()
        
        if user:
            # get existing session or create a new one
            if body.session_id:
                session = db.query(ChatSession).filter(
                    ChatSession.id == body.session_id,
                    ChatSession.user_id == user.id
                ).first()
            else:
                session = None
            
            if not session:
                # create a new session titled after the first question
                session = ChatSession(
                    user_id=user.id,
                    title=body.question[:40]  # first 40 chars as title
                )
                db.add(session)
                db.commit()
                db.refresh(session)
            
            # save user message
            db.add(Message(
                session_id=session.id,
                role="user",
                text=body.question
            ))
            
            # save bot response
            db.add(Message(
                session_id=session.id,
                role="bot",
                text=answer
            ))
            
            db.commit()
            
            return {
                "question": body.question,
                "answer": answer,
                "session_id": session.id  # frontend stores this for next message
            }
    
    # no token — just return the answer, nothing saved
    return {
        "question": body.question,
        "answer": answer,
        "session_id": None
    }