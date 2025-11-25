# backend/app/models/topic.py

from datetime import date, datetime

from sqlalchemy import Date, Float, Integer, String, Text
from sqlalchemy.orm import Mapped, mapped_column

from app.db.base import Base


class Topic(Base):
    """
    SQLAlchemy ORM model for technical AI topics.

    This represents a single "topic" that the frontend shows
    on the Dashboard and Topics page.

    We're keeping tags as a comma-separated string for the MVP
    (e.g. "LLMs,RAG,Agents") to avoid extra tables for now.
    """

    __tablename__ = "topics"

    # Primary key
    id: Mapped[int] = mapped_column(Integer, primary_key=True, index=True)

    # Basic info
    title: Mapped[str] = mapped_column(String, nullable=False, index=True)
    short_summary: Mapped[str] = mapped_column(String, nullable=False)
    full_summary: Mapped[str] = mapped_column(Text, nullable=True)

    # Source metadata
    source: Mapped[str] = mapped_column(String, nullable=False, default="Unknown")
    source_url: Mapped[str] = mapped_column(String, nullable=True)

    # Date the topic belongs to (e.g., the "daily" date)
    date: Mapped[date] = mapped_column(Date, nullable=False, index=True)

    # Scores
    trendiness: Mapped[float] = mapped_column(Float, nullable=False, default=0.0)
    technical_depth: Mapped[float] = mapped_column(Float, nullable=False, default=0.0)
    practicality: Mapped[float] = mapped_column(Float, nullable=False, default=0.0)

    # Tags stored as comma-separated string, e.g. "LLMs,RAG,Long Context"
    tags_csv: Mapped[str] = mapped_column(String, nullable=True)

    # Timestamps
    created_at: Mapped[datetime] = mapped_column(
        default=datetime.utcnow,
        nullable=False,
    )