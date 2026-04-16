# app/retrieval/embeddings.py
import ollama
from app.core.config import settings

def embed(text: str) -> list[float]:
    """
    Converts a string of text into a vector using the snowflake-arctic-embed:22m model.
    This vector is a list of numbers that represents the meaning of the text
    in a way that similar texts will have similar vectors.
    """
    if not isinstance(text, str) or not text.strip():
        raise ValueError("embed() received empty or non-string text")

    client = ollama.Client(host=settings.OLLAMA_HOST)

    response = client.embed(
        model="snowflake-arctic-embed:22m", # Faster embedding model
        input=text.strip()
    )

    return response["embeddings"][0]