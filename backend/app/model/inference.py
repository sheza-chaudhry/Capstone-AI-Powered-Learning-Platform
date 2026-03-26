import ollama
from app.core.config import settings

def get_response(question: str, history: list = []) -> str:
    # Build message history in the format Ollama expects
    messages = []
    recent_history = history[-5:]  # only last 5 messages

    for msg in recent_history:
        role = "assistant" if msg.role == "bot" else "user"
        messages.append({
            "role": role,
            "content": msg.text
        })

    # Add the current question at the end
    messages.append({
        "role": "user",
        "content": question
    })

    client = ollama.Client(host=settings.OLLAMA_HOST)
    response = client.chat(
        model="gemma3",
        messages=messages
    )
    return response["message"]["content"]