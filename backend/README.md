# Backend – Offline AI Chatbot

## Overview

This backend service is built using:

- **FastAPI** – API framework
- **Uvicorn** – ASGI server
- **Ollama** – local model serving (Gemma3)
- **Docker & Docker Compose** – containerization

## Project Structure

```
backend/
├── app/
│   ├── main.py            # FastAPI entry point
│   ├── api/
│   │   └── routes.py      # API endpoints
│   ├── model/
│   │   └── inference.py   # Ollama model integration
│   └── core/
│       └── config.py      # Configuration and env variables
├── requirements.txt
├── Dockerfile
├── docker-compose.yml
├── .env
└── README.md
```

---

## Option 1: Run with Docker (Recommended)

**Prerequisites:**
     Docker Desktop must be installed on your machine.
     Download it at https://www.docker.com/products/docker-desktop

No Python or Ollama installation needed on your machine.

**1. Clone the repo and enter the backend folder:**
```bash
git clone <repo-url>
cd backend
```

**2. Add the `.env` file you were given to the backend folder**

**3. Start all services:**
```bash
docker compose up --build
```

**4. Pull Gemma3 into the Ollama container in a separate terminal (first time only):**
```bash
docker exec -it backend-ollama-1 ollama pull gemma3
```
> The Gemma3 model is saved in a Docker volume — you will not need to re-download it on future starts.

**5. Open Swagger UI:**
```
http://localhost:8000/docs
```

**To stop:**
```bash
docker compose down
```


---

## Option 2: Run Locally

**1. Install Ollama:**

- WSL/Linux: `curl -fsSL https://ollama.com/install.sh | sh`
- Mac/Windows: https://ollama.com/download

**2. Pull the model:**
```bash
ollama pull gemma3
```

**3. Create and activate a virtual environment:**
```bash
python3 -m venv venv
source venv/bin/activate      # Mac/Linux/WSL
venv\Scripts\activate         # Windows
```

**4. Install dependencies:**
```bash
pip install -r requirements.txt
```

**5. Add the `.env` file you were given to the backend folder**

**6. Start the server:**
```bash
uvicorn app.main:app --reload
```

**7. Open Swagger UI:**
```
http://localhost:8000/docs
```

---

## Architecture

```
Client (Browser / API)
         │
         ▼
    FastAPI App
    (Uvicorn ASGI)
         │
         ▼
    /ask Endpoint
         │
         ▼
   inference.py
         │
         ▼
   Ollama Server
   (Gemma3 model)
```

---

## Sprint Status

| Sprint | Goal | Status |
|--------|------|--------|
| Sprint 1 | FastAPI skeleton, mock `/ask` endpoint, Docker setup | ✅ Complete |
| Sprint 2 | Retrieval backbone with ChromaDB | 🔄 In Progress |
| Sprint 3 | MVP – fine tuning, model switching, logging | ⏳ Upcoming |
| Sprint 4 | Testing, analytics, teacher dashboard support | ⏳ Upcoming |
| Sprint 5 | Finalization and deployment | ⏳ Upcoming |
