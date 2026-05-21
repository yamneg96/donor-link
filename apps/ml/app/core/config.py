"""
Application configuration using Pydantic Settings.
Loads from environment variables and .env file.
"""

from pydantic_settings import BaseSettings
from functools import lru_cache


class Settings(BaseSettings):
    # ── App ──────────────────────────────────────────
    app_name: str = "DonorLink ML Intelligence Service"
    app_version: str = "1.0.0"
    environment: str = "development"
    debug: bool = False

    # ── Server ───────────────────────────────────────
    host: str = "0.0.0.0"
    port: int = 8000

    # ── Security ─────────────────────────────────────
    ml_api_key: str = "dl-ml-dev-key-change-in-prod"

    # ── Express backend URL ──────────────────────────
    express_api_url: str = "http://localhost:5000/api/v1"

    # ── CORS ─────────────────────────────────────────
    allowed_origins: str = "http://localhost:5173,http://localhost:5174,http://localhost:5175"

    # ── Logging ──────────────────────────────────────
    log_level: str = "INFO"

    @property
    def cors_origins(self) -> list[str]:
        return [o.strip() for o in self.allowed_origins.split(",") if o.strip()]

    model_config = {
        "env_file": ".env",
        "env_file_encoding": "utf-8",
        "case_sensitive": False,
    }


@lru_cache()
def get_settings() -> Settings:
    """Cached singleton settings instance."""
    return Settings()
