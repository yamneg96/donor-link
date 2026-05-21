"""
API key authentication middleware for securing ML endpoints.
"""

from fastapi import Security, HTTPException, status
from fastapi.security import APIKeyHeader
from app.core.config import get_settings

api_key_header = APIKeyHeader(name="X-ML-API-Key", auto_error=False)


async def verify_api_key(
    api_key: str | None = Security(api_key_header),
) -> str:
    """
    Verify the API key from the request header.
    In development mode with no key set, allows passthrough.
    """
    settings = get_settings()

    # In dev mode, skip auth if no key is configured
    if settings.environment == "development" and not api_key:
        return "dev-passthrough"

    if not api_key or api_key != settings.ml_api_key:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid or missing API key",
        )

    return api_key
