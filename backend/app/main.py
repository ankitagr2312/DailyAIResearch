from fastapi import FastAPI
from .core.config import get_settings
from app.api.routes import auth_router, topics_router, chat_router
#from app.api.routes.topics import router as topics_router
from fastapi.middleware.cors import CORSMiddleware


# Get global settings (loaded from environment / .env)
settings = get_settings()


# Create FastAPI app using project name from settings
app = FastAPI(
    title=settings.PROJECT_NAME,
    version="0.1.0",
    description="Backend API for the DailyAIResearch copilot (MVP).",
)

# For CORS error , added this. Need to change later on.
origins = [
    "http://localhost:3000",
    "http://127.0.0.1:3000",
]

# Add CORS middleware using origins from settings
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],      # you can set ["*"] for dev as a quick test
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include auth routes
app.include_router(auth_router)

# Include topic routes
app.include_router(topics_router)

# Include chat routes
app.include_router(chat_router)


# Health endpoint
@app.get(f"{settings.API_V1_PREFIX}/health", tags=["Health"])
def health_check():
    return {"status": "ok"}

# NEW DB TEST ENDPOINT
from fastapi import Depends
from sqlalchemy.orm import Session
from app.db.session import get_db
from sqlalchemy import text

@app.get(f"{settings.API_V1_PREFIX}/dbtest", tags=["Health"])
def db_test(db: Session = Depends(get_db)):
    db.execute(text("SELECT 1"))
    return {"db": "connected"}
