from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from src.core.config import settings
from src.api.routes import router

app = FastAPI(
    title="Lockulture Multi-Agent Backend",
    description="Backend API cho ứng dụng Lockulture (Time Traveler's Locket) phục vụ Mini Hackathon GDG 2026",
    version="2.0.0"
)

# Cho phép Mobile App kết nối qua CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(router, prefix="/api/v1")

@app.get("/health")
def healthcheck():
    return {
        "status": "HEALTHY",
        "service": "lockulture-backend",
        "environment": settings.ENV,
        "model": settings.GEMINI_MODEL
    }
