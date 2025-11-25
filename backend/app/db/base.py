from sqlalchemy.orm import DeclarativeBase


class Base(DeclarativeBase):
    """Base class for all SQLAlchemy ORM models."""
    pass

from app.models.user import User  # noqa
from app.models.topic import Topic  # noqa
from app.models.chat import ChatSession, ChatMessage  # noqa: F401