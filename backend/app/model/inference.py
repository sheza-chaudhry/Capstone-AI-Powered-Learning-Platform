# app/model/inference.py
import ollama
from app.core.config import settings

def get_response(question: str) -> str:
    client = ollama.Client(host=settings.OLLAMA_HOST)
    response = client.chat(
        model="gemma3",
        messages=[{"role": "user", "content": question}]
    )
    return response["message"]["content"]