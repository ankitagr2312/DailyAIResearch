# backend/app/api/routes/topics.py

from datetime import date
from typing import List, Optional

from fastapi import APIRouter, Depends, Query
from sqlalchemy import Select, and_, select
from sqlalchemy.orm import Session

from app.core.config import get_settings
from app.db.session import get_db
from app.models.topic import Topic
from app.schemas.topic import TopicRead, TopicScores


settings = get_settings()

router = APIRouter(
    prefix=f"{settings.API_V1_PREFIX}/topics",
    tags=["Topics"],
)


def _topic_to_schema(topic: Topic) -> TopicRead:
    """
    Helper to convert Topic ORM object -> TopicRead schema,
    including tags_csv -> tags list and scores packing.
    """
    tags = (
        [t.strip() for t in topic.tags_csv.split(",") if t.strip()]
        if topic.tags_csv
        else []
    )

    scores = TopicScores(
        trendiness=topic.trendiness,
        technical_depth=topic.technical_depth,
        practicality=topic.practicality,
    )

    return TopicRead(
        id=topic.id,
        title=topic.title,
        short_summary=topic.short_summary,
        source=topic.source,
        source_url=topic.source_url,
        date=topic.date,
        tags=tags,
        scores=scores,
        created_at=topic.created_at,
    )


@router.get("", response_model=List[TopicRead])
def list_topics(
        db: Session = Depends(get_db),
        date_filter: Optional[date] = Query(
            None,
            alias="date",
            description="Filter topics by date (YYYY-MM-DD). Defaults to today if not provided.",
        ),
        tag: Optional[str] = Query(
            None,
            description="Filter topics by a single tag, e.g. 'LLMs'.",
        ),
        search: Optional[str] = Query(
            None,
            description="Free text search in title / short_summary.",
        ),
        sort_by: Optional[str] = Query(
            "created_at",
            description='trendiness | technical_depth | practicality | created_at',
        ),
        order: Optional[str] = Query(
            "desc",
            description='asc | desc',
        ),
) -> List[TopicRead]:
    """
    List topics with optional filters and sorting.

    This powers the Dashboard & Topics page.
    """
    stmt: Select = select(Topic)

    # Date filter: if provided, filter by that date
    if date_filter is not None:
        stmt = stmt.where(Topic.date == date_filter)

    # Tag filter: simple LIKE on tags_csv (MVP)
    if tag:
        like_pattern = f"%{tag}%"
        stmt = stmt.where(Topic.tags_csv.ilike(like_pattern))

    # Text search: title or short_summary
    if search:
        like = f"%{search}%"
        stmt = stmt.where(
            and_(
                (Topic.title.ilike(like)) | (Topic.short_summary.ilike(like))
            )
        )

    # Sorting
    sort_column_map = {
        "trendiness": Topic.trendiness,
        "technical_depth": Topic.technical_depth,
        "practicality": Topic.practicality,
        "created_at": Topic.created_at,
    }
    sort_col = sort_column_map.get(sort_by or "created_at", Topic.created_at)

    if order == "asc":
        stmt = stmt.order_by(sort_col.asc())
    else:
        stmt = stmt.order_by(sort_col.desc())

    # Execute
    result = db.execute(stmt)
    topics = result.scalars().all()

    # Convert to schema objects
    return [_topic_to_schema(t) for t in topics]


@router.get("/{topic_id}", response_model=TopicRead)
def get_topic(
        topic_id: int,
        db: Session = Depends(get_db),
) -> TopicRead:
    """
    Get a single topic by ID.
    """
    stmt = select(Topic).where(Topic.id == topic_id)
    topic = db.execute(stmt).scalar_one_or_none()

    if topic is None:
        from fastapi import HTTPException, status

        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Topic not found",
        )

    return _topic_to_schema(topic)