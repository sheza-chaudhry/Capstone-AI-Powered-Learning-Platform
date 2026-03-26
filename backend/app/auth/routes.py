# app/auth/routes.py
from fastapi import APIRouter, HTTPException, Depends
from pydantic import BaseModel
from sqlalchemy.orm import Session
from app.database.connection import get_db
from app.database.models import User
from app.auth.utils import (
    hash_password,
    verify_password,
    create_access_token,
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