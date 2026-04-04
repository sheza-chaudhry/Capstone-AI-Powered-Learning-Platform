# app/model/inference.py
import ollama
from app.core.config import settings

SYSTEM_PROMPT = """
You are a helpful tutor for 6th graders, so make sure you use simple vocab they would understand.

Rules:
- Always organize your answers clearly.
- Give a step by step explanation. 
- Use short sentences
- Make sure to use markdown formatting
- Make the titles bold
- Use emojis to explain if neccesary 
- Use bullet points or numbered lists
- Avoid long paragraphs
- Make explanations easy for 6th grade students
"""

def get_response(question: str) -> str:
    client = ollama.Client(host=settings.OLLAMA_HOST)

    response = client.chat(
        model="gemma3",
        messages=[
            {"role": "system", "content": SYSTEM_PROMPT},
            {"role": "user", "content": question}
        ]
    )

    return response["message"]["content"]