"""
rag.py — RAG Math Tutor 
 
Pipeline:
PDF / text file → chunk → embed (ollama) → ChromaDB
Question → embed → retrieve top-k chunks → gemma3 → answer
 
Dependencies:
pip install chromadb pymupdf ollama
ollama pull gemma3
ollama pull nomic-embed-text # embedding model
"""

import json
import os
import ollama
import chromadb
from chromadb.config import Settings

client = ollama.Client(host="http://127.0.0.1:11434")

# ── Configuration ────────────────────────────────────────────────────────────

TEXTBOOK_PATH = "grade6textbook.pdf"  # path to your PDF (or .txt)
DATASET_PATH = "grade6_worked_examples.jsonl"
OUTPUT_FILE = "rag_results.json"

GEN_MODEL = "gemma3"
EMBED_MODEL = "nomic-embed-text"  # fast, good quality, runs via ollama

CHUNK_SIZE = 300  # words per chunk
CHUNK_OVERLAP = 50  # words of overlap between chunks
TOP_K = 4  # chunks retrieved per question

COLLECTION_NAME = "math_textbook"

# ── Text extraction ───────────────────────────────────────────────────────────


def extract_text_from_pdf(path: str) -> str:
    """Extract all text from a PDF using PyMuPDF (fitz)."""
    import fitz  # pip install pymupdf
    doc = fitz.open(path)
    pages = []
    for page_num, page in enumerate(doc, start=1):
        text = page.get_text()
        if text.strip():
            pages.append(f"[Page {page_num}]\n{text}")
        
    return "\n\n".join(pages)


def extract_text_from_txt(path: str) -> str:
    with open(path) as f:
        return f.read()


def load_textbook(path: str) -> str:
    if path.endswith(".pdf"):
        print(f"Extracting text from PDF: {path}")
        return extract_text_from_pdf(path)
    else:
        print(f"Loading text file: {path}")
        return extract_text_from_txt(path)


# ── Chunking ──────────────────────────────────────────────────────────────────

def chunk_text(text: str, chunk_size: int = CHUNK_SIZE,
               overlap: int = CHUNK_OVERLAP) -> list[dict]:

    """
    Split text into overlapping word-based chunks.
    Returns list of {"id": str, "text": str}.
    """
    words = text.split()
    chunks = []
    start = 0
    idx = 0

    while start < len(words):
        end = min(start + chunk_size, len(words))
        chunk = " ".join(words[start:end])
        chunks.append({"id": f"chunk_{idx}", "text": chunk})
        idx += 1
        start += chunk_size - overlap  # slide forward with overlap

    print(f"Created {len(chunks)} chunks (size={chunk_size}, overlap={overlap})")

    return chunks


# ── Embedding ─────────────────────────────────────────────────────────────────

def embed(text: str) -> list[float]:
    if not isinstance(text, str) or not text.strip():
        raise ValueError("embed() received empty or non-string text")

    try:
        response = client.embed(model=EMBED_MODEL, input=text.strip())
        return response["embeddings"][0]
    except Exception as e:
        raise


# ── Vector store (ChromaDB) ───────────────────────────────────────────────────

def build_vector_store(chunks: list[dict]) -> chromadb.Collection:
    """
    Create (or reset) a ChromaDB collection and load all chunks into it.
    Embeddings are generated with Ollama locally.
    """
    client = chromadb.Client(Settings(anonymized_telemetry=False))

    # Start fresh each run (safe for a capstone; swap to PersistentClient to cache)
    try:
        client.delete_collection(COLLECTION_NAME)
    except Exception:
        pass

    collection = client.create_collection(COLLECTION_NAME)

    print("Embedding chunks and loading into ChromaDB…")
    for i, chunk in enumerate(chunks):
        if i % 20 == 0:
            print(f" {i}/{len(chunks)}")
        vec = embed(chunk["text"])
        collection.add(
            ids=[chunk["id"]],
            embeddings=[vec],
            documents=[chunk["text"]],
        )

    print(f"Vector store ready — {collection.count()} entries")
    return collection


# ── Retrieval ─────────────────────────────────────────────────────────────────

def retrieve(question: str, collection: chromadb.Collection,
             top_k: int = TOP_K) -> list[str]:

    """Return the top-k most relevant text chunks for the question."""
    q_vec = embed(question)
    results = collection.query(
        query_embeddings=[q_vec],
        n_results=top_k,
    )
    return results["documents"][0]  # list of chunk strings


# ── Prompt construction ───────────────────────────────────────────────────────

def build_prompt(question: str, chunks: list[str]) -> str:
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


# ── Generation ────────────────────────────────────────────────────────────────
SYSTEM_PROMPT = """
You are a helpful Grade 6 math tutor.

Rules:
- Use only the provided textbook context.
- If the context does not contain enough information, say: "I’m not sure based on the textbook context provided."
- Explain the solution clearly and in simple language for a Grade 6 student.
- Show steps when solving math problems.
- Do not invent formulas, definitions, or facts not supported by the context.
- If helpful, end with one short check-for-understanding question.
- Do not be overly verbose.
"""

def ask_gemma_rag(question: str, collection: chromadb.Collection) -> dict:

    """Retrieve relevant chunks, build prompt, generate answer."""
    chunks = retrieve(question, collection)
    prompt = build_prompt(question, chunks)
    response = client.chat(
        model=GEN_MODEL,
        messages=[
            {"role": "system", "content": SYSTEM_PROMPT},
            {"role": "user", "content": prompt},
        ],
    )
    return {
        "answer": response["message"]["content"],
        "retrieved_chunks": chunks,
    }


# ── Dataset loading (unchanged from baseline) ─────────────────────────────────

def load_dataset(filepath: str) -> list[dict]:
    data = []
    with open(filepath) as f:
        for line in f:
            data.append(json.loads(line))
    
    return data


# ── Main ──────────────────────────────────────────────────────────────────────

if __name__ == "__main__":

    # 1. Build the vector store from the textbook (once per run)
    if os.path.exists(TEXTBOOK_PATH):
        raw_text = load_textbook(TEXTBOOK_PATH)
        chunks = chunk_text(raw_text)
    else:
        # Fallback: embed the worked examples themselves as the knowledge base
        print(f"WARNING: {TEXTBOOK_PATH} not found — using dataset as knowledge base")
        dataset_raw = load_dataset(DATASET_PATH)
        chunks = [
            {"id": f"chunk_{i}",
            "text": f"Q: {ex['question']}\nA: {ex.get('explanation', ex.get('answer', ''))}"}
            for i, ex in enumerate(dataset_raw)
        ]

    collection = build_vector_store(chunks)

    # 2. Run over every question in the dataset
    dataset = load_dataset(DATASET_PATH)
    results = []

    for i, item in enumerate(dataset):
        question = item["question"]
        expected_answer = item.get("answer", "")
        expected_explanation = item.get("explanation", "")

        print(f"\n{'='*60}")
        print(f"Question {i+1}/{len(dataset)}")
        print(f"Q: {question}")
        print(f"Expected: {expected_answer}")

        rag_output = ask_gemma_rag(question, collection)
        model_answer = rag_output["answer"]
        print(f"RAG Answer: {model_answer[:200]}…")

        results.append({
            "index": i + 1,
            "question": question,
            "expected_answer": expected_answer,
            "expected_explanation": expected_explanation,
            "model_response": model_answer,
            "retrieved_chunks": rag_output["retrieved_chunks"],
        })

    # 3. Save results in the same format as baseline_results.json
    with open(OUTPUT_FILE, "w") as f:
        json.dump(results, f, indent=2)

    print(f"\n{'='*60}")
    print(f"Done! {len(results)} results saved to {OUTPUT_FILE}")
