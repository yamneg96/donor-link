"""
DonorLink ML Intelligence Service — FastAPI entry point.

A specialized computational intelligence microservice for the
DonorLink national blood logistics platform.

Engines:
  - Demand Forecasting (statistical ensemble)
  - Anomaly Detection (z-score)
  - Shortage Risk Scoring (weighted scoring)
  - Redistribution Recommendations (weighted ranking)
  - Expiry Risk Intelligence (rule engine)
"""

from contextlib import asynccontextmanager
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.core.config import get_settings
from app.core.logging import setup_logging

# Route imports
from app.api.routes.health import router as health_router
from app.api.routes.forecasting import router as forecasting_router
from app.api.routes.anomaly import router as anomaly_router
from app.api.routes.scoring import router as scoring_router
from app.api.routes.recommendations import router as recommendations_router
from app.api.routes.expiry import router as expiry_router


@asynccontextmanager
async def lifespan(app: FastAPI):
    """Application startup and shutdown lifecycle."""
    logger = setup_logging()
    settings = get_settings()
    logger.info(f"Starting {settings.app_name} v{settings.app_version}")
    logger.info(f"Environment: {settings.environment}")
    logger.info(f"CORS origins: {settings.cors_origins}")
    logger.info("All intelligence engines initialized")
    yield
    logger.info("Shutting down ML Intelligence Service")


def create_app() -> FastAPI:
    """Create and configure the FastAPI application."""
    settings = get_settings()

    app = FastAPI(
        title=settings.app_name,
        version=settings.app_version,
        description=(
            "Computational intelligence microservice for the DonorLink "
            "national blood logistics platform. Provides demand forecasting, "
            "anomaly detection, shortage risk scoring, redistribution "
            "recommendations, and expiry risk intelligence."
        ),
        docs_url="/docs",
        redoc_url="/redoc",
        lifespan=lifespan,
    )

    # ── CORS ─────────────────────────────────────────
    app.add_middleware(
        CORSMiddleware,
        allow_origins=settings.cors_origins,
        allow_credentials=True,
        allow_methods=["*"],
        allow_headers=["*"],
    )

    # ── Routers ──────────────────────────────────────
    app.include_router(health_router)
    app.include_router(forecasting_router)
    app.include_router(anomaly_router)
    app.include_router(scoring_router)
    app.include_router(recommendations_router)
    app.include_router(expiry_router)

    return app


app = create_app()


if __name__ == "__main__":
    import uvicorn

    settings = get_settings()
    uvicorn.run(
        "app.main:app",
        host=settings.host,
        port=settings.port,
        reload=settings.debug,
    )
