from functools import lru_cache
from typing import List

from pydantic import AnyHttpUrl
from pydantic_settings import BaseSettings


class Settings(BaseSettings):
    """
    Application configuration loaded from environment variables (or .env file).

    Each attribute here becomes a setting you can override via env vars,
    e.g. DATABASE_URL, JWT_SECRET_KEY, etc.
    """

    # General
    ENVIRONMENT: str = "local"  # "local", "dev", "prod", etc.
    PROJECT_NAME: str = "DailyAIResearch API"
    API_V1_PREFIX: str = "/api"

    # CORS
    BACKEND_CORS_ORIGINS: List[AnyHttpUrl] = [
        "http://localhost:3000",
        "https://localhost:3000",
    ]

    # Database
    DATABASE_URL: str = (
        "postgresql+psycopg2://postgres:postgres@localhost:5432/dailyairesearch"
    )

    # Auth / JWT
    JWT_SECRET_KEY: str = "CHANGE_ME"  # override in .env for real usage
    JWT_ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 60

    # AI
    OLLAMA_BASE_URL: str = "http://127.0.0.1:11434"
    OLLAMA_MODEL: str = "gemma3:1b"

    # Vector store
    MILVUS_URI: str = "milvus.db"  # Milvus Lite local file / path

    class Config:
        """
        Pydantic Settings config.

        - env_file tells it to load variables from a .env file if present.
        """

        env_file = ".env"
        env_file_encoding = "utf-8"


@lru_cache
def get_settings() -> Settings:
    """
    Returns a cached Settings instance.

    lru_cache ensures we only create the Settings object once,
    and reuse it (cheap & thread-safe).
    """
    return Settings()