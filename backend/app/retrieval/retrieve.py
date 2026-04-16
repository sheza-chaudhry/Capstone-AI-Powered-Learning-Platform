# app/retrieval/retrieve.py
import chromadb
from app.retrieval.embeddings import embed

TOP_K = 2 

SYSTEM_PROMPT = """
You are a patient math tutor for Nepalese students (Grades 1–12).

Answer using simple, clear language and focus on understanding.
- Show steps.
- Explain what to do and why.
- Use short, clean formatting.
- Highlight the final answer.

If unsure, say so honestly.
Do not invent formulas. Use the textbook context provided.
Keep tone friendly and supportive.
"""


def retrieve(question: str, collection: chromadb.Collection) -> list[str]:
    """
    Converts the question to a vector, then searches ChromaDB
    for the TOP_K most semantically similar chunks.
    Returns a list of text strings — these are the relevant
    parts of the textbook for this question.
    """
    q_vec = embed(question)
    results = collection.query(
        query_embeddings=[q_vec],
        n_results=TOP_K,
    )
    return results["documents"][0]


def build_prompt(question: str, chunks: list[str]) -> str:
    """
    Wraps the retrieved chunks and the student's question
    into a single prompt string for Gemma3.
    The chunks become the context the model uses to answer.
    """
    context = "\n\n---\n\n".join(chunks)
    return f"""
Use the textbook context below to answer the student's question.

If the answer is fully supported by the context:
1. Give the answer
2. Show the steps
3. Explain briefly why

If the context is incomplete, say that clearly.

=== TEXTBOOK CONTEXT ===
{context}

=== STUDENT QUESTION ===
{question}
"""