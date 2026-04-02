# app/auth/routes.py
from fastapi import APIRouter, HTTPException, Depends, Request
from pydantic import BaseModel
from sqlalchemy.orm import Session
from app.database.connection import get_db
from app.database.models import User, ChatSession, Message
from app.auth.utils import (
    hash_password,
    verify_password,
    create_access_token,
    decode_access_token,
    validate_username,
    validate_password
)

router = APIRouter()

class RegisterRequest(BaseModel):
    username: str
    password: str

class LoginRequest(BaseModel):
    username: str
    password: str


@router.post("/register")
def register(request: RegisterRequest, db: Session = Depends(get_db)):
    # validate inputs
    valid, error = validate_username(request.username)
    if not valid:
        raise HTTPException(status_code=400, detail=error)

    valid, error = validate_password(request.password)
    if not valid:
        raise HTTPException(status_code=400, detail=error)

    # check if username already exists
    existing_user = db.query(User).filter(User.username == request.username).first()
    if existing_user:
        raise HTTPException(status_code=400, detail="Username already taken")

    # create and save the new user
    new_user = User(
        username=request.username,
        hashed_password=hash_password(request.password)
    )
    db.add(new_user)
    db.commit()
    db.refresh(new_user)

    return {"message": f"Account created successfully for {request.username}"}


@router.post("/login")
def login(request: LoginRequest, db: Session = Depends(get_db)):
    # find the user
    user = db.query(User).filter(User.username == request.username).first()

    # deliberately vague error — don't tell them which field is wrong
    if not user or not verify_password(request.password, user.hashed_password):
        raise HTTPException(status_code=401, detail="Invalid username or password")

    # generate token
    token = create_access_token(data={"sub": user.username})

    return {
        "access_token": token,
        "token_type": "bearer",
        "username": user.username
    }

@router.get("/sessions")
def get_sessions(request: Request, db: Session = Depends(get_db)):
    """
    Returns all chat sessions for the logged in user.
    """
    auth_header = request.headers.get("Authorization")
    if not auth_header or not auth_header.startswith("Bearer "):
        raise HTTPException(status_code=401, detail="Not logged in")

    token = auth_header.split(" ")[1]
    payload = decode_access_token(token)
    if not payload:
        raise HTTPException(status_code=401, detail="Invalid or expired token")

    username = payload.get("sub")
    user = db.query(User).filter(User.username == username).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")

    sessions = (
        db.query(ChatSession)
        .filter(ChatSession.user_id == user.id)
        .order_by(ChatSession.created_at.desc())
        .all()
    )

    return [
        {
            "session_id": s.id,
            "title": s.title,
            "created_at": s.created_at,
        }
        for s in sessions
    ]


@router.get("/sessions/{session_id}/messages")
def get_session_messages(
    session_id: int,
    request: Request,
    db: Session = Depends(get_db)
):
    """
    Returns all messages for a specific session.
    """
    auth_header = request.headers.get("Authorization")
    if not auth_header or not auth_header.startswith("Bearer "):
        raise HTTPException(status_code=401, detail="Not logged in")

    token = auth_header.split(" ")[1]
    payload = decode_access_token(token)
    if not payload:
        raise HTTPException(status_code=401, detail="Invalid or expired token")

    username = payload.get("sub")
    user = db.query(User).filter(User.username == username).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")

    session = db.query(ChatSession).filter(
        ChatSession.id == session_id,
        ChatSession.user_id == user.id  # ensure session belongs to this user
    ).first()

    if not session:
        raise HTTPException(status_code=404, detail="Session not found")

    messages = (
        db.query(Message)
        .filter(Message.session_id == session_id)
        .order_by(Message.created_at.asc())
        .all()
    )

    return {
        "session_id": session.id,
        "title": session.title,
        "messages": [
            {
                "role": m.role,
                "text": m.text,
                "time": m.created_at.strftime("%I:%M %p")
            }
            for m in messages
        ]
    }


@router.delete("/sessions/{session_id}")
def delete_session(
    session_id: int,
    request: Request,
    db: Session = Depends(get_db)
):
    """
    Deletes a session and all its messages.
    """
    auth_header = request.headers.get("Authorization")
    if not auth_header or not auth_header.startswith("Bearer "):
        raise HTTPException(status_code=401, detail="Not logged in")

    token = auth_header.split(" ")[1]
    payload = decode_access_token(token)
    if not payload:
        raise HTTPException(status_code=401, detail="Invalid or expired token")

    username = payload.get("sub")
    user = db.query(User).filter(User.username == username).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")

    session = db.query(ChatSession).filter(
        ChatSession.id == session_id,
        ChatSession.user_id == user.id
    ).first()

    if not session:
        raise HTTPException(status_code=404, detail="Session not found")

    # delete messages first, then the session
    db.query(Message).filter(Message.session_id == session_id).delete()
    db.delete(session)
    db.commit()

    return {"message": "Session deleted"}