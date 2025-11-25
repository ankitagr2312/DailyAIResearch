# backend/app/schemas/topic.py

from datetime import date, datetime
from typing import List, Optional

from pydantic import BaseModel


class TopicScores(BaseModel):
    trendiness: float
    technical_depth: float
    practicality: float


class TopicBase(BaseModel):
    title: str
    short_summary: str
    source: str
    source_url: Optional[str] = None
    date: date
    tags: List[str] = []
    scores: TopicScores


class TopicRead(TopicBase):
    id: int
    created_at: datetime

    class Config:
        # Allow conversion from SQLAlchemy ORM objects
        from_attributes = True