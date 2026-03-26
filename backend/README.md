# Backend – Offline AI Chatbot

## Overview

This backend service is built using:

- **FastAPI** – API framework
- **Uvicorn** – ASGI server
- **Ollama** – local model serving (Gemma3)
- **PostgreSQL** – database for users and chat history
- **Docker & Docker Compose** – containerization

## Project Structure

```
backend/
├── app/
│   ├── main.py                # FastAPI entry point
│   ├── api/
│   │   └── routes.py          # Chat endpoints
│   ├── model/
│   │   └── inference.py       # Ollama model integration
│   ├── auth/
│   │   ├── routes.py          # /auth/register and /auth/login
│   │   └── utils.py           # Password hashing and JWT tokens
│   ├── database/
│   │   ├── connection.py      # Database connection
│   │   └── models.py          # User, ChatSession, Message tables
│   └── core/
│       └── config.py          # Configuration and env variables
├── requirements.txt
├── Dockerfile
├── docker-compose.yml
├── .env.example
└── README.md
```

---

## Option 1: Run with Docker (Recommended)

**Prerequisites:**
Docker Desktop must be installed on your machine.
Download it at https://www.docker.com/products/docker-desktop

No Python, Ollama, or PostgreSQL installation needed — everything runs in containers.

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

## Sprint Status

| Sprint | Goal | Status |
|--------|------|--------|
| Sprint 1 | FastAPI skeleton, mock `/ask` endpoint, Docker setup | ✅ Complete |
| Sprint 2 | User auth, model connected, chat history, Docker Compose with all services | ✅ Complete |
| Sprint 3 | MVP – retrieval with ChromaDB, model switching, conversation logging | 🔄 In Progress |
| Sprint 4 | Testing, analytics, teacher dashboard support | ⏳ Upcoming |
| Sprint 5 | Finalization and deployment | ⏳ Upcoming |