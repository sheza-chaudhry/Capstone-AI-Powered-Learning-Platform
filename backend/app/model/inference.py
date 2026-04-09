# app/model/inference.py
import ollama
from app.core.config import settings
from app.retrieval import (
    get_collection,
    collection_exists,
    retrieve,
    build_prompt,
)
from app.retrieval.retrieve import SYSTEM_PROMPT
from app.retrieval.retrieve import SYSTEM_PROMPT_NO_TEXTBOOK


RECENT_HISTORY = 5


def get_response(question: str, history: list = []) -> str:
    """
    If the vector store has been built, uses RAG to retrieve
    relevant textbook chunks before answering.
    If not, falls back to plain Gemma3 with no context.
    """
    client = ollama.Client(host=settings.OLLAMA_HOST)

    # build conversation history
    messages = []
    recent_history = history[-RECENT_HISTORY:]
    for msg in recent_history:
        role = "assistant" if msg.role == "bot" else "user"
        messages.append({"role": role, "content": msg.text})

    if collection_exists():
        # RAG path — retrieve context and build prompt
        collection = get_collection()
        chunks = retrieve(question, collection)
        prompt = build_prompt(question, chunks)
        messages.append({"role": "user", "content": prompt})

        response = client.chat(
            model="gemma3",
            messages=[
                {"role": "system", "content": SYSTEM_PROMPT},
                *messages,
            ]
        )
    else:
        # fallback — no textbook loaded yet, plain model response
        messages.append({"role": "user", "content": question})
        response = client.chat(
            model="gemma3",
            messages=[
                {"role": "system", "content": SYSTEM_PROMPT_NO_TEXTBOOK},
                *messages,
            ]
        )

    return response["message"]["content"]