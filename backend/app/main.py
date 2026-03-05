from fastapi import FastAPI
from app.api.routes import router
# Included to avoid CORS error
from fastapi.middleware.cors import CORSMiddleware


app = FastAPI(title="Offline AI Chatbot Backend")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(router)

@app.get("/")
def root():
    return {"message": "Backend is running"}