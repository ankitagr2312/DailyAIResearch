# app/models/chat.py

from datetime import datetime
from typing import List, Optional

from sqlalchemy import DateTime, ForeignKey, Integer, String, Text, Boolean
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.db.base import Base


class ChatSession(Base):
    """
    Represents a single conversation between a user and the AI.

    - One user can have many chat sessions
    - A session can optionally be linked to a Topic (for topic chat)
    - A session has many ChatMessage rows
    """

    __tablename__ = "chat_sessions"

    # Primary key
    id: Mapped[int] = mapped_column(Integer, primary_key=True, index=True)

    # Which user owns this chat session
    user_id: Mapped[int] = mapped_column(
        Integer,
        ForeignKey("users.id"),
        nullable=False,
        index=True,
    )

    # Optional link to a topic (NULL means "global chat")
    topic_id: Mapped[Optional[int]] = mapped_column(
        Integer,
        ForeignKey("topics.id"),
        nullable=True,
        index=True,
    )

    # "global" or "topic" (could add other modes later)
    mode: Mapped[str] = mapped_column(
        String(20),
        nullable=False,
        default="global",
    )

    # Optional human-readable title shown in UI
    title: Mapped[Optional[str]] = mapped_column(
        String(255),
        nullable=True,
    )

    # Soft-delete / hide without losing data
    is_archived: Mapped[bool] = mapped_column(
        Boolean,
        nullable=False,
        default=False,
    )

    # Timestamps
    created_at: Mapped[datetime] = mapped_column(
        DateTime,
        default=datetime.utcnow,
        nullable=False,
    )
    updated_at: Mapped[datetime] = mapped_column(
        DateTime,
        default=datetime.utcnow,
        onupdate=datetime.utcnow,
        nullable=False,
    )

    # Relationship: a session has many messages
    messages: Mapped[List["ChatMessage"]] = relationship(
        back_populates="session",
        cascade="all, delete-orphan",
        order_by="ChatMessage.created_at",
    )


class ChatMessage(Base):
    """
    A single message inside a chat session.

    - role = "user" or "assistant"
    - content = message text
    """

    __tablename__ = "chat_messages"

    # Primary key
    id: Mapped[int] = mapped_column(Integer, primary_key=True, index=True)

    # Which session this message belongs to
    session_id: Mapped[int] = mapped_column(
        Integer,
        ForeignKey("chat_sessions.id"),
        nullable=False,
        index=True,
    )

    # "user" or "assistant" (later maybe "system")
    role: Mapped[str] = mapped_column(
        String(20),
        nullable=False,
    )

    # The actual message text
    content: Mapped[str] = mapped_column(
        Text,
        nullable=False,
    )

    created_at: Mapped[datetime] = mapped_column(
        DateTime,
        default=datetime.utcnow,
        nullable=False,
    )

    # Relationship back to the session
    session: Mapped["ChatSession"] = relationship(
        back_populates="messages",
    )