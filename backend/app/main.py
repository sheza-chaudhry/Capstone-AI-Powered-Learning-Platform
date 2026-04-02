# app/main.py
from contextlib import asynccontextmanager
import os
import ollama
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.security import OAuth2PasswordBearer
from app.api.routes import router as chat_router
from app.auth.routes import router as auth_router
from app.database.connection import Base, engine
from app.core.config import settings
from app.retrieval import (
    build_vector_store,
    collection_exists,
    chunk_text,
)


def load_textbook_chunks() -> list[dict] | None:
    """
    Looks for a textbook file in the data/ folder.
    Returns chunks if found, None if no file exists yet.
    """
    pdf_path = "data/grade6textbook.pdf"
    txt_path = "data/grade6textbook.txt"

    if os.path.exists(pdf_path):
        import fitz
        print("Loading textbook PDF...")
        doc = fitz.open(pdf_path)
        pages = []
        for page_num, page in enumerate(doc, start=1):
            text = page.get_text()
            if text.strip():
                pages.append(f"[Page {page_num}]\n{text}")
        raw_text = "\n\n".join(pages)
        return chunk_text(raw_text)

    elif os.path.exists(txt_path):
        print("Loading textbook text file...")
        with open(txt_path) as f:
            raw_text = f.read()
        return chunk_text(raw_text)

    return None


@asynccontextmanager
async def lifespan(app: FastAPI):
    # build vector store if textbook exists and store isn't built yet
    if not collection_exists():
        chunks = load_textbook_chunks()
        if chunks:
            print("Building vector store from textbook...")
            build_vector_store(chunks)
        else:
            print("No textbook found in data/ — RAG disabled until file is added")
    else:
        print("Vector store already built — skipping rebuild")

    # warm up Ollama
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

    # shutdown — unload model from memory
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