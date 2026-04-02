# app/main.py
from contextlib import asynccontextmanager
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.security import OAuth2PasswordBearer
import ollama
from app.api.routes import router as chat_router
from app.auth.routes import router as auth_router
from app.database.connection import Base, engine
from app.core.config import settings


@asynccontextmanager
async def lifespan(app: FastAPI):
    # runs when the server starts — warms up Ollama so first request is fast
    print("Warming up Ollama model...")
    try:
        client = ollama.Client(host=settings.OLLAMA_HOST)
        client.chat(
            model="gemma3",
            messages=[{"role": "user", "content": "hi"}]
        )
        print("Model ready")
    except Exception as e:
        print(f"Ollama warmup failed: {e}")
    yield

    print("Unloading Ollama model...")
    try:
        client = ollama.Client(host=settings.OLLAMA_HOST)
        client.generate(model="gemma3", keep_alive=0)
        print("Model unloaded")
    except Exception as e:
        print(f"Ollama shutdown failed: {e}")


Base.metadata.create_all(bind=engine)

app = FastAPI(
    title="Offline AI Chatbot Backend",
    lifespan=lifespan,
    swagger_ui_parameters={"persistAuthorization": True}
)

oauth2_scheme = OAuth2PasswordBearer(tokenUrl="/auth/login")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(chat_router)
app.include_router(auth_router, prefix="/auth", tags=["auth"])


@app.get("/")
def root():
    return {"message": "Backend is running"}