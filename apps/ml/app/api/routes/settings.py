"""
Settings management API routes.
GET /settings — retrieve current ML configuration.
PUT /settings — update ML configuration (persisted to settings.json).
"""

import json
from pathlib import Path
from fastapi import APIRouter, HTTPException
from app.schemas.settings import MLSettings, MLSettingsUpdate
from app.core import constants

router = APIRouter(prefix="/settings", tags=["Settings"])

# Persistence file path (alongside the app directory)
SETTINGS_FILE = Path(__file__).resolve().parents[3] / "settings.json"


def _load_settings() -> MLSettings:
    """Load settings from JSON file, falling back to current constants."""
    if SETTINGS_FILE.exists():
        try:
            data = json.loads(SETTINGS_FILE.read_text(encoding="utf-8"))
            return MLSettings(**data)
        except Exception:
            pass

    # Build from current constants
    return MLSettings(
        anomaly={
            "default_threshold": constants.DEFAULT_ANOMALY_THRESHOLD,
            "critical_threshold": constants.CRITICAL_ANOMALY_THRESHOLD,
        },
        forecast={
            "default_forecast_days": constants.DEFAULT_FORECAST_DAYS,
            "max_forecast_days": constants.MAX_FORECAST_DAYS,
            "min_historical_points": constants.MIN_HISTORICAL_POINTS,
        },
        risk_levels={
            level: {"min": bounds[0], "max": bounds[1]}
            for level, bounds in constants.RISK_LEVELS.items()
        },
        shelf_life=constants.SHELF_LIFE,
        scoring_weights={
            "inventory_ratio": 0.30,
            "demand_pressure": 0.25,
            "pending_requests": 0.15,
            "emergency_factor": 0.15,
            "supply_coverage": 0.15,
        },
        redistribution_weights={
            "availability": 0.35,
            "proximity": 0.25,
            "expiry_risk": 0.20,
            "surplus": 0.20,
        },
    )


def _save_settings(settings: MLSettings) -> None:
    """Persist settings to JSON and hot-reload in-memory constants."""
    SETTINGS_FILE.write_text(
        settings.model_dump_json(indent=2), encoding="utf-8"
    )
    _apply_to_constants(settings)


def _apply_to_constants(settings: MLSettings) -> None:
    """Hot-reload settings into the in-memory constants module."""
    constants.DEFAULT_ANOMALY_THRESHOLD = settings.anomaly.default_threshold
    constants.CRITICAL_ANOMALY_THRESHOLD = settings.anomaly.critical_threshold

    constants.DEFAULT_FORECAST_DAYS = settings.forecast.default_forecast_days
    constants.MAX_FORECAST_DAYS = settings.forecast.max_forecast_days
    constants.MIN_HISTORICAL_POINTS = settings.forecast.min_historical_points

    constants.RISK_LEVELS = {
        "critical": (settings.risk_levels.critical.min, settings.risk_levels.critical.max),
        "high": (settings.risk_levels.high.min, settings.risk_levels.high.max),
        "medium": (settings.risk_levels.medium.min, settings.risk_levels.medium.max),
        "low": (settings.risk_levels.low.min, settings.risk_levels.low.max),
    }

    constants.SHELF_LIFE = {
        "whole_blood": settings.shelf_life.whole_blood,
        "red_blood_cells": settings.shelf_life.red_blood_cells,
        "platelets": settings.shelf_life.platelets,
        "plasma_frozen": settings.shelf_life.plasma_frozen,
        "cryoprecipitate": settings.shelf_life.cryoprecipitate,
    }

    # Scoring weights are read from ScoringService.WEIGHTS
    from app.services.scoring_service import scoring_service
    scoring_service.WEIGHTS = settings.scoring_weights.model_dump()

    # Redistribution weights
    from app.services.recommendation_service import recommendation_service
    recommendation_service.WEIGHTS = settings.redistribution_weights.model_dump()


def _validate_weights(weights: dict[str, float], name: str) -> None:
    """Ensure weight values sum to 1.0 (within tolerance)."""
    total = sum(weights.values())
    if not (0.99 <= total <= 1.01):
        raise HTTPException(
            status_code=422,
            detail=f"{name} weights must sum to 1.0 (got {total:.3f})",
        )


# ── Routes ───────────────────────────────────────────


@router.get("", response_model=MLSettings)
async def get_settings():
    """Return the current ML configuration."""
    return _load_settings()


@router.put("", response_model=MLSettings)
async def update_settings(update: MLSettingsUpdate):
    """Update ML configuration. Only provided fields are changed."""
    current = _load_settings()
    update_data = update.model_dump(exclude_none=True)

    # Validate weight sums if provided
    if "scoring_weights" in update_data:
        _validate_weights(update_data["scoring_weights"], "Scoring")
    if "redistribution_weights" in update_data:
        _validate_weights(update_data["redistribution_weights"], "Redistribution")

    # Merge
    merged = current.model_copy(update=update_data)
    _save_settings(merged)
    return merged
