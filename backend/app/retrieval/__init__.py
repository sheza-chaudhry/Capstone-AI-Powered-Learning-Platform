# app/retrieval/__init__.py
from app.retrieval.vectorstore import (
    build_vector_store,
    get_collection,
    collection_exists,
    chunk_text,
)
from app.retrieval.retrieve import retrieve, build_prompt
from app.retrieval.embeddings import embed