# app/schemas/chat.py

from datetime import datetime
from typing import List, Optional

from pydantic import BaseModel, field_validator


# ─────────────────────────────
# Message Schemas
# ─────────────────────────────

class ChatMessageCreate(BaseModel):
    """
    Data sent by the client when creating a new user message.
    """
    content: str


class ChatMessageRead(BaseModel):
    """
    Message as returned by the API.
    """
    id: int
    session_id: int
    role: str
    content: str
    created_at: datetime

    class Config:
        # allow constructing from SQLAlchemy ORM objects
        from_attributes = True


# ─────────────────────────────
# Session Schemas
# ─────────────────────────────

class ChatSessionBase(BaseModel):
    """
    Common fields when creating a chat session.
    """
    mode: str = "global"         # "global" or "topic"
    topic_id: Optional[int] = None
    title: Optional[str] = None

    @field_validator("mode")
    @classmethod
    def validate_mode(cls, v: str) -> str:
        if v not in ("global", "topic"):
            raise ValueError("mode must be 'global' or 'topic'")
        return v


class ChatSessionCreate(ChatSessionBase):
    """
    Body for creating a new chat session.
    """
    pass


class ChatSessionRead(BaseModel):
    """
    Chat session as returned by the API.
    """
    id: int
    mode: str
    title: Optional[str]
    user_id: int
    topic_id: Optional[int]
    is_archived: bool
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True


# ─────────────────────────────
# Combined response for a chat turn
# ─────────────────────────────

class ChatTurnResponse(BaseModel):
    """
    Response when the user sends a new message:
    - the session info
    - the new user + assistant messages
    """
    session: ChatSessionRead
    messages: List[ChatMessageRead]