# app/api/routes/chat.py

from datetime import datetime
from typing import List, Optional

from fastapi import APIRouter, Depends, HTTPException, Query, status
from sqlalchemy import Select, select
from sqlalchemy.orm import Session

from app.core.config import get_settings
from app.core.deps import get_current_user
from app.db.session import get_db
from app.models.chat import ChatSession, ChatMessage
from app.models.user import User
from app.schemas.chat import (
    ChatSessionCreate,
    ChatSessionRead,
    ChatMessageCreate,
    ChatMessageRead,
    ChatTurnResponse,
)
from app.models.topic import Topic
from app.services.llm import generate_llm_reply

settings = get_settings()

router = APIRouter(
    prefix=f"{settings.API_V1_PREFIX}/chat",
    tags=["Chat"],
)


# ─────────────────────────────
# Helpers
# ─────────────────────────────

def _get_user_session_or_404(
        db: Session,
        session_id: int,
        current_user: User,
) -> ChatSession:
    """
    Load a chat session and ensure it belongs to the current user.
    Raise 404 if not found or not owned.
    """
    stmt: Select = select(ChatSession).where(ChatSession.id == session_id)
    session_obj = db.execute(stmt).scalar_one_or_none()

    if session_obj is None or session_obj.user_id != current_user.id:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Chat session not found",
        )

    return session_obj


# ─────────────────────────────
# Session endpoints
# ─────────────────────────────

@router.get("/sessions", response_model=List[ChatSessionRead])
def list_chat_sessions(
        db: Session = Depends(get_db),
        current_user: User = Depends(get_current_user),
        mode: Optional[str] = Query(
            None,
            description="Filter by mode: 'global' or 'topic'",
        ),
        topic_id: Optional[int] = Query(
            None,
            description="Filter by topic_id (only for topic sessions).",
        ),
        include_archived: bool = Query(
            False,
            description="If true, include archived sessions as well.",
        ),
        limit: int = Query(20, ge=1, le=100),
        offset: int = Query(0, ge=0),
) -> List[ChatSessionRead]:
    """
    List the current user's chat sessions, most recent first.
    """
    stmt: Select = select(ChatSession).where(ChatSession.user_id == current_user.id)

    if not include_archived:
        stmt = stmt.where(ChatSession.is_archived.is_(False))

    if mode in ("global", "topic"):
        stmt = stmt.where(ChatSession.mode == mode)

    if topic_id is not None:
        stmt = stmt.where(ChatSession.topic_id == topic_id)

    stmt = (
        stmt.order_by(ChatSession.updated_at.desc())
        .offset(offset)
        .limit(limit)
    )

    result = db.execute(stmt)
    sessions = result.scalars().all()
    return sessions


@router.post("/sessions", response_model=ChatSessionRead, status_code=status.HTTP_201_CREATED)
def create_chat_session(
        session_in: ChatSessionCreate,
        db: Session = Depends(get_db),
        current_user: User = Depends(get_current_user),
) -> ChatSessionRead:
    """
    Create a new chat session (global or topic).
    """
    # Validate mode/topic combination
    if session_in.mode == "topic" and session_in.topic_id is None:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="topic_id is required when mode='topic'",
        )
    if session_in.mode == "global" and session_in.topic_id is not None:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="topic_id must be null when mode='global'",
        )

    now = datetime.utcnow()

    session_obj = ChatSession(
        user_id=current_user.id,
        mode=session_in.mode,
        topic_id=session_in.topic_id,
        title=session_in.title,
        created_at=now,
        updated_at=now,
    )

    db.add(session_obj)
    db.commit()
    db.refresh(session_obj)

    return session_obj


@router.get("/sessions/{session_id}", response_model=ChatSessionRead)
def get_chat_session(
        session_id: int,
        db: Session = Depends(get_db),
        current_user: User = Depends(get_current_user),
) -> ChatSessionRead:
    """
    Get a single chat session (without messages).
    """
    session_obj = _get_user_session_or_404(db, session_id, current_user)
    return session_obj


@router.delete("/sessions/{session_id}", status_code=status.HTTP_204_NO_CONTENT)
def archive_chat_session(
        session_id: int,
        db: Session = Depends(get_db),
        current_user: User = Depends(get_current_user),
) -> None:
    """
    Soft-delete (archive) a chat session.
    """
    session_obj = _get_user_session_or_404(db, session_id, current_user)

    session_obj.is_archived = True
    session_obj.updated_at = datetime.utcnow()

    db.add(session_obj)
    db.commit()
    # No response body (204)
    return None


# ─────────────────────────────
# Message endpoints
# ─────────────────────────────

@router.get("/sessions/{session_id}/messages", response_model=List[ChatMessageRead])
def list_chat_messages(
        session_id: int,
        db: Session = Depends(get_db),
        current_user: User = Depends(get_current_user),
        limit: int = Query(100, ge=1, le=500),
        offset: int = Query(0, ge=0),
) -> List[ChatMessageRead]:
    """
    List messages of a chat session in chronological order.
    """
    session_obj = _get_user_session_or_404(db, session_id, current_user)

    stmt: Select = (
        select(ChatMessage)
        .where(ChatMessage.session_id == session_obj.id)
        .order_by(ChatMessage.created_at.asc())
        .offset(offset)
        .limit(limit)
    )

    result = db.execute(stmt)
    messages = result.scalars().all()
    return messages


@router.post("/sessions/{session_id}/messages", response_model=ChatTurnResponse)
def send_message(
        session_id: int,
        message_in: ChatMessageCreate,
        db: Session = Depends(get_db),
        current_user: User = Depends(get_current_user),
) -> ChatTurnResponse:
    """
    Non-streaming chat endpoint:

    - Stores a new user message
    - Generates a placeholder assistant reply
    - Stores the assistant message
    - Returns both messages + session info
    """
    session_obj = _get_user_session_or_404(db, session_id, current_user)

    # 1. Create user message
    user_msg = ChatMessage(
        session_id=session_obj.id,
        role="user",
        content=message_in.content,
        created_at=datetime.utcnow(),
    )
    db.add(user_msg)
    db.flush()  # assign id without full commit yet

    # 2. Generate assistant reply via Ollama
    topic_obj: Optional[Topic] = None
    if session_obj.mode == "topic" and session_obj.topic_id is not None:
        topic_obj = db.get(Topic, session_obj.topic_id)

    assistant_text = generate_llm_reply(
        user_message=message_in.content,
        mode=session_obj.mode,
        topic=topic_obj,
    )

    assistant_msg = ChatMessage(
        session_id=session_obj.id,
        role="assistant",
        content=assistant_text,
        created_at=datetime.utcnow(),
    )
    db.add(assistant_msg)

    # 3. Update session timestamp
    session_obj.updated_at = datetime.utcnow()
    db.add(session_obj)

    # 4. Commit everything
    db.commit()

    # 5. Refresh objects to get DB-generated fields (ids, timestamps)
    db.refresh(session_obj)
    db.refresh(user_msg)
    db.refresh(assistant_msg)

    return ChatTurnResponse(
        session=session_obj,
        messages=[user_msg, assistant_msg],
    )