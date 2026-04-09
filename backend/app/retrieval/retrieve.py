# app/retrieval/retrieve.py
import chromadb
from app.retrieval.embeddings import embed

TOP_K = 4

SYSTEM_PROMPT = """
You are a helpful Grade 6 math tutor.

Rules:
- Use only the provided textbook context.
- If the context does not contain enough information, say: 
  "I'm not sure based on the textbook context provided."
- Explain the solution clearly and in simple language for a Grade 6 student.
- Show steps when solving math problems.
- Do not invent formulas, definitions, or facts not supported by the context.
- If helpful, end with one short check-for-understanding question.
- Do not be overly verbose.
"""

SYSTEM_PROMPT_NO_TEXTBOOK = """
You are a helpful Grade 6 math tutor.

Rules:
- Explain the solution clearly and in simple language for a Grade 6 student.
- Show steps when solving math problems.
- If helpful, end with one short check-for-understanding question.
- Do not be overly verbose.
- Present ALL math in latex format.
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