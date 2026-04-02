# app/retrieval/vectorstore.py
import chromadb
from chromadb.config import Settings
from app.retrieval.embeddings import embed

COLLECTION_NAME = "math_textbook"
CHUNK_SIZE = 300
CHUNK_OVERLAP = 50


def chunk_text(text: str) -> list[dict]:
    """
    Splits raw text into overlapping word-based chunks.
    Each chunk is a dict with an id and the text content.
    Overlap means the last 50 words of one chunk are repeated
    at the start of the next — this prevents information being
    cut off at chunk boundaries.
    """
    words = text.split()
    chunks = []
    start = 0
    idx = 0

    while start < len(words):
        end = min(start + CHUNK_SIZE, len(words))
        chunk = " ".join(words[start:end])
        chunks.append({"id": f"chunk_{idx}", "text": chunk})
        idx += 1
        start += CHUNK_SIZE - CHUNK_OVERLAP

    print(f"Created {len(chunks)} chunks")
    return chunks


def get_chroma_client() -> chromadb.ClientAPI:
    """
    Returns a persistent ChromaDB client that saves to disk.
    This means the vector store
    survives restarts — you don't re-embed the whole textbook
    every time the server starts.
    """
    return chromadb.PersistentClient(
        path="data/chromadb",
        settings=Settings(anonymized_telemetry=False)
    )


def collection_exists() -> bool:
    """
    Checks if the vector store has already been built.
    Used at startup to avoid re-embedding on every restart.
    """
    try:
        client = get_chroma_client()
        col = client.get_collection(COLLECTION_NAME)
        return col.count() > 0
    except Exception:
        return False


def build_vector_store(chunks: list[dict]) -> chromadb.Collection:
    """
    Embeds all chunks and loads them into ChromaDB.
    Deletes and rebuilds the collection if it already exists
    so stale data doesn't mix with new data.
    """
    client = get_chroma_client()

    try:
        client.delete_collection(COLLECTION_NAME)
    except Exception:
        pass

    collection = client.create_collection(COLLECTION_NAME)

    print(f"Embedding {len(chunks)} chunks into ChromaDB...")
    for i, chunk in enumerate(chunks):
        if i % 20 == 0:
            print(f"  {i}/{len(chunks)}")
        vec = embed(chunk["text"])
        collection.add(
            ids=[chunk["id"]],
            embeddings=[vec],
            documents=[chunk["text"]],
        )

    print(f"Vector store ready — {collection.count()} entries")
    return collection


def get_collection() -> chromadb.Collection:
    """
    Returns the existing ChromaDB collection.
    Call this after the vector store has been built.
    """
    client = get_chroma_client()
    return client.get_collection(COLLECTION_NAME)