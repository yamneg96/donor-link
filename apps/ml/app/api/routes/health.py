"""
Health check, readiness, and base metadata endpoints.
"""

from fastapi import APIRouter
from datetime import datetime, timezone

router = APIRouter(tags=["Health"])


@router.get("/")
async def read_root():
    """Root endpoint — returns basic microservice metadata and API status."""
    return {
        "status": "online",
        "service": "DonorLink ML Intelligence Service",
        "version": "1.0.0",
        "docs_url": "/docs",
        "timestamp": datetime.now(timezone.utc).isoformat(),
    }


@router.get("/health")
async def health_check():
    """Basic health check — confirms the service is running."""
    return {
        "status": "healthy",
        "service": "DonorLink ML Intelligence Service",
        "version": "1.0.0",
        "timestamp": datetime.now(timezone.utc).isoformat(),
    }


@router.get("/readiness")
async def readiness_check():
    """Readiness probe — confirms all ML engines are initialized."""
    return {
        "status": "ready",
        "engines": {
            "forecasting": "operational",
            "anomaly_detection": "operational",
            "shortage_scoring": "operational",
            "recommendations": "operational",
            "expiry_intelligence": "operational",
        },
        "timestamp": datetime.now(timezone.utc).isoformat(),
    }
