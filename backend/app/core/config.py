import os
from typing import List, Union
from pydantic import AnyHttpUrl, field_validator
from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    PROJECT_NAME: str = "AAVYA – HeredityAI"
    VERSION: str = "1.0.0"
    API_V1_STR: str = "/api/v1"
    ENVIRONMENT: str = "development"
    SECRET_KEY: str = "aavya-heredity-ai-dev-secret-key-change-in-prod-2026"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 60 * 24 * 7  # 7 days

    # NeonDB / PostgreSQL connection string
    # e.g., postgresql://neondb_owner:password@ep-xyz.us-east-2.aws.neon.tech/neondb?sslmode=require
    DATABASE_URL: str = "sqlite+aiosqlite:///./aavya_dev.db"

    # CORS origins for frontend Next.js dev and production
    CORS_ORIGINS: List[str] = [
        "http://localhost:3000",
        "http://127.0.0.1:3000",
        "http://localhost:5173",
        "http://127.0.0.1:5173",
    ]

    model_config = SettingsConfigDict(
        env_file=".env",
        env_file_encoding="utf-8",
        case_sensitive=True,
        extra="ignore"
    )

    @property
    def async_database_url(self) -> str:
        """
        Normalizes database URL for SQLAlchemy asyncpg engine.
        Converts postgres:// or postgresql:// to postgresql+asyncpg://
        Handles NeonDB SSL parameters.
        """
        url = self.DATABASE_URL
        if not url:
            return "sqlite+aiosqlite:///./aavya_dev.db"

        if url.startswith("postgres://"):
            url = url.replace("postgres://", "postgresql+asyncpg://", 1)
        elif url.startswith("postgresql://") and not url.startswith("postgresql+asyncpg://"):
            url = url.replace("postgresql://", "postgresql+asyncpg://", 1)

        # Handle sslmode parameter for asyncpg
        if "sslmode=require" in url:
            url = url.replace("sslmode=require", "ssl=require")

        return url

    @property
    def is_sqlite(self) -> bool:
        return "sqlite" in self.async_database_url


settings = Settings()
