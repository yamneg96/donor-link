"""
Shared FastAPI dependencies for route injection.
"""

from fastapi import Depends
from app.core.security import verify_api_key


async def require_auth(api_key: str = Depends(verify_api_key)) -> str:
    """Dependency that enforces API key authentication."""
    return api_key
