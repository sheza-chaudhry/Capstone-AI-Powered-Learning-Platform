# Backend – Offline AI Chatbot

## Overview

This backend service is built using:

- **FastAPI** (API framework)
- **Uvicorn** (ASGI server)
- **Docker** (containerization)

Sprint 1 implements the foundational backend structure and a mock `/ask` endpoint.

## Project Structure

```
backend/
│
├── app/
│   ├── main.py          # FastAPI application entry point
│   ├── api/
│   │   └── routes.py    # API endpoints
│   └── core/
│       └── config.py    # Configuration settings
│
├── requirements.txt
├── Dockerfile
└── README.md
```

## Run Locally (Development)

1. **Create virtual environment:**
   ```bash
   python3 -m venv venv
   source venv/bin/activate
   ```

2. **Install dependencies:**
   ```bash
   pip install -r requirements.txt
   ```

3. **Start server:**
   ```bash
   uvicorn app.main:app --reload
   ```

4. **Open Swagger UI:**
   ```
   http://localhost:8000/docs
   ```

## Run with Docker (Required Sprint Deliverable)

1. **Build image:**
   ```bash
   docker build -t chatbot-backend .
   ```

2. **Run container:**
   ```bash
   docker run -p 8000:8000 chatbot-backend
   ```

3. **Access API:**
   ```
   http://localhost:8000/docs
   ```

## Sprint 1 Architecture

```
                ┌───────────────┐
                │     Client     │
                │  (Browser/API) │
                └───────┬───────┘
                        │ HTTP Request
                        ▼
                ┌─────────────────┐
                │    FastAPI App   │
                │  (Uvicorn ASGI)  │
                └────────┬────────┘
                         │
                         ▼
                ┌─────────────────┐
                │   /ask Endpoint │
                │  (Mock Response)│
                └─────────────────┘
```

## Planned Future Architecture

```
Client
   │
   ▼
FastAPI
   │
   ▼
Retrieval Layer (ChromaDB)
   │
   ▼
Model Inference
   │
   ▼
Logging & Postgres
```