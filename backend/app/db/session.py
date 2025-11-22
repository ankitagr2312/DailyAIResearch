from typing import Generator

from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker

from app.core.config import get_settings


# Load application settings (including DATABASE_URL)
settings = get_settings()


# Create the SQLAlchemy engine using the database URL from settings
engine = create_engine(
    settings.DATABASE_URL,
    pool_pre_ping=True,  # Checks connections before using them, avoids stale connections
)


# SessionLocal is a factory for new Session objects
SessionLocal = sessionmaker(
    autocommit=False,  # We want to control when commits happen
    autoflush=False,   # We manually control when data is flushed to the DB
    bind=engine,       # This sessionmaker will use the engine we defined above
)


def get_db() -> Generator:
    """
    FastAPI dependency that provides a database session.

    Usage in routes:
        def some_route(db: Session = Depends(get_db)):
            ...

    - Creates a new SessionLocal instance
    - Yields it to the path operation function
    - Ensures the session is closed after the request is done
    """
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

from app.db.base import Base
Base.metadata.create_all(bind=engine)