# app/api/routes/__init__.py

from app.api.routes.auth import router as auth_router
from app.api.routes.topics import router as topics_router
from app.api.routes.chat import router as chat_router

__all__ = [
    "auth_router",
    "topics_router",
    "chat_router",
]