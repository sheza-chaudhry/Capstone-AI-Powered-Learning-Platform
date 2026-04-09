# Frontend - Offline AI Chatbot

## Overview

This frontend service is build using:
- **React** - Javascript library for building user interfaces
- **NextJS** - React framework

## Option 1: Start running via terminal

**1. Clone the repo and enter the frontend folder:**
```bash
git clone <repo-url>
cd frontend
```

**2. Start the application:**
```npm run dev
```

**3. Open the application in a browser window:**
Click the  local link listed after the above command is ran to run the 
application locally in a browser.

Ex:
> frontend@0.1.0 dev
> next dev

▲ Next.js 16.1.6 (Turbopack)
- Local:         http://localhost:3000

**To stop:**
Hit Control C in the terminal window you ran the above command to 
start the application.


# Backend – Offline AI Chatbot

## Overview

This backend service is built using:

- **FastAPI** – API framework  
- **Uvicorn** – ASGI server  
- **Ollama** – local model serving (Gemma3)  
- **ChromaDB** – vector database for retrieval-augmented generation (RAG)  
- **PostgreSQL** – database for users and chat history  
- **Docker & Docker Compose** – containerization  

## Project Structure

```
backend/
├── app/
│   ├── main.py                    # FastAPI entry point
│
│   ├── api/
│   │   └── routes.py              # Chat endpoints
│
│   ├── model/
│   │   └── inference.py           # Ollama model integration
│
│   ├── retrieval/
│   │   ├── __init__.py
│   │   ├── embeddings.py          # embed() function
│   │   ├── vectorstore.py         # ChromaDB setup + build_vector_store()
│   │   └── retrieve.py            # retrieve() + build_prompt()
│
│   ├── auth/
│   │   ├── routes.py              # /auth/register and /auth/login
│   │   └── utils.py               # Password hashing + JWT tokens
│
│   ├── database/
│   │   ├── connection.py          # Database connection
│   │   └── models.py              # User, ChatSession, Message tables
│
│   └── core/
│       └── config.py              # Config + environment variables
│
├── data/
│   └── grade6textbook.pdf         # Source document for RAG
│
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

No Python, Ollama,chromaDB or PostgreSQL installation needed — everything runs in containers.

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
> **Note:** On first startup, expect an additional 30 seconds before the API is 
ready to accept requests. This is the Ollama server loading the Gemma3 model 
into memory. This applies to both Docker and local runs. Subsequent requests 
will be significantly faster as the model stays loaded for the duration of the session.

**4. Pull models into the Ollama container (first time only):**
```bash
docker exec -it backend-ollama-1 ollama pull gemma3
docker exec -it backend-ollama-1 ollama pull nomic-embed-text
```
> If the container name differs, run `docker ps` to find the correct name.
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

### Step 1 — Install Ollama

- **WSL/Linux:**
```bash
curl -fsSL https://ollama.com/install.sh | sh
```
- **Mac/Windows:** https://ollama.com/download

Pull the model:
```bash
ollama pull gemma3
ollama pull nomic-embed-text
```

---

### Step 2 — Install PostgreSQL

- **WSL/Linux (Ubuntu):**
```bash
sudo apt update
sudo apt install postgresql postgresql-contrib
sudo service postgresql start
```

- **Mac:**
```bash
brew install postgresql@16
brew services start postgresql@16
```

- **Windows:** Download the installer at https://www.postgresql.org/download/windows

---

### Step 3 — Set Up the Database

Connect to PostgreSQL:
```bash
sudo -u postgres psql
```

Run these commands, replacing the values with what is in your `.env` file:
```sql
CREATE USER your_db_user WITH PASSWORD 'your_db_password';
CREATE DATABASE your_db_name OWNER your_db_user;
GRANT ALL PRIVILEGES ON DATABASE your_db_name TO your_db_user;
\q
```

---

### Step 4 — Set Up Python Environment

Create and activate a virtual environment:
```bash
python3 -m venv venv
source venv/bin/activate      # Mac/Linux/WSL
venv\Scripts\activate         # Windows
```

Install dependencies:
```bash
pip install -r requirements.txt
```

---

### Step 5 — Configure Environment

Add the `.env` file you were given to the backend folder.

---

### Step 6 — Start the Server

```bash
uvicorn app.main:app --reload
```
> **Note:** On first startup, expect an additional 30 seconds before the API is 
ready to accept requests. This is the Ollama server loading the Gemma3 model 
into memory. This applies to both Docker and local runs. Subsequent requests 
will be significantly faster as the model stays loaded for the duration of the session.

Open Swagger UI:
```
http://localhost:8000/docs
```

---

## Auth Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/auth/register` | Create a new account |
| POST | `/auth/login` | Login and receive a token |
| POST | `/ask` | Ask the AI a question |
| GET | `/auth/sessions` | Get all sessions for logged in user |
| GET | `/auth/sessions/{id}/messages` | Get messages for a session |
| DELETE | `/auth/sessions/{id}` | Delete a session and its messages |

Register first, then login to receive a token. The `/ask` endpoint works without a token — login is optional.

---

## Architecture

```
Client (Browser / API)
         │
         ▼
    FastAPI App
    (Uvicorn ASGI)
         │
    ┌────┴─────┐
    ▼          ▼
/auth        /ask
endpoints   endpoint
    │          │
    ▼          ▼
PostgreSQL  inference.py
(users &       │
 sessions)     ▼
          Ollama Server
          (Gemma3 model)
```

---

## RAG Pipeline

When a textbook file is present in the `data/` folder, the backend
automatically builds a vector store on startup and uses it to retrieve
relevant context before answering questions. If no file is present,
the model answers using its general knowledge only.
```
Student question
      │
      ▼
nomic-embed-text (embedding model)
      │
      ▼
ChromaDB (vector similarity search)
      │
      ▼
Top 4 relevant textbook chunks
      │
      ▼
Gemma3 (answer using retrieved context)
```

### Adding Textbook Data

Place the textbook file in the `data/` folder before starting the server:
```
data/
└── grade6textbook.pdf    ← or grade6textbook.txt
```

The vector store builds automatically on first startup and persists
to `data/chromadb/` — it will not rebuild on subsequent restarts
unless the collection is manually deleted.

## Sprint Status

| Sprint | Goal | Status |
|--------|------|--------|
| Sprint 1 | FastAPI skeleton, mock `/ask` endpoint, Docker setup | ✅ Complete |
| Sprint 2 | User auth, model connected, chat history, Docker Compose with all services | ✅ Complete |
| Sprint 3 | MVP – retrieval with ChromaDB, model switching, conversation logging | 🔄 In Progress |
| Sprint 4 | Testing, analytics, teacher dashboard support | ⏳ Upcoming |
| Sprint 5 | Finalization and deployment | ⏳ Upcoming |