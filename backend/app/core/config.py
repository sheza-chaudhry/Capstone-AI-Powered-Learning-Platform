# app/core/config.py
import os
from dotenv import load_dotenv

load_dotenv()

class Settings:
    PROJECT_NAME: str = "Offline AI Chatbot"
    API_VERSION: str = "v1"
    OLLAMA_HOST: str = os.getenv("OLLAMA_HOST", "")
    DATABASE_URL: str = os.getenv("DATABASE_URL", "")
    SECRET_KEY: str = os.getenv("SECRET_KEY", "")

settings = Settings()