# app/core/config.py
import os
from dotenv import load_dotenv

load_dotenv()  # reads .env file if it exists

class Settings:
    PROJECT_NAME: str = "Offline AI Chatbot"
    API_VERSION: str = "v1"
    OLLAMA_HOST: str = os.getenv("OLLAMA_HOST", "http://localhost:11434")

settings = Settings()