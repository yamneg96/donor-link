"""
Pydantic models for ML settings management.
Defines the schema for all configurable ML parameters.
"""

from pydantic import BaseModel, Field
from typing import Optional


class AnomalySettings(BaseModel):
    default_threshold: float = Field(2.0, ge=0.5, le=5.0, description="Default z-score threshold for anomaly detection")
    critical_threshold: float = Field(3.0, ge=1.0, le=10.0, description="Z-score threshold for critical anomalies")


class ForecastSettings(BaseModel):
    default_forecast_days: int = Field(7, ge=1, le=90, description="Default number of days to forecast")
    max_forecast_days: int = Field(30, ge=7, le=365, description="Maximum allowed forecast horizon")
    min_historical_points: int = Field(3, ge=2, le=30, description="Minimum historical data points required")


class RiskLevelRange(BaseModel):
    min: float = Field(ge=0.0, le=1.0)
    max: float = Field(ge=0.0, le=1.0)


class RiskLevelSettings(BaseModel):
    critical: RiskLevelRange = Field(default_factory=lambda: RiskLevelRange(min=0.8, max=1.0))
    high: RiskLevelRange = Field(default_factory=lambda: RiskLevelRange(min=0.6, max=0.8))
    medium: RiskLevelRange = Field(default_factory=lambda: RiskLevelRange(min=0.3, max=0.6))
    low: RiskLevelRange = Field(default_factory=lambda: RiskLevelRange(min=0.0, max=0.3))


class ShelfLifeSettings(BaseModel):
    whole_blood: int = Field(35, ge=1, le=365, description="Shelf life in days")
    red_blood_cells: int = Field(42, ge=1, le=365)
    platelets: int = Field(5, ge=1, le=30)
    plasma_frozen: int = Field(365, ge=1, le=730)
    cryoprecipitate: int = Field(365, ge=1, le=730)


class ScoringWeights(BaseModel):
    """Shortage risk scoring weights — must sum to 1.0."""
    inventory_ratio: float = Field(0.30, ge=0.0, le=1.0)
    demand_pressure: float = Field(0.25, ge=0.0, le=1.0)
    pending_requests: float = Field(0.15, ge=0.0, le=1.0)
    emergency_factor: float = Field(0.15, ge=0.0, le=1.0)
    supply_coverage: float = Field(0.15, ge=0.0, le=1.0)


class RedistributionWeights(BaseModel):
    """Redistribution recommendation weights — must sum to 1.0."""
    availability: float = Field(0.35, ge=0.0, le=1.0)
    proximity: float = Field(0.25, ge=0.0, le=1.0)
    expiry_risk: float = Field(0.20, ge=0.0, le=1.0)
    surplus: float = Field(0.20, ge=0.0, le=1.0)


class MLSettings(BaseModel):
    """Complete ML configuration settings."""
    anomaly: AnomalySettings = Field(default_factory=AnomalySettings)
    forecast: ForecastSettings = Field(default_factory=ForecastSettings)
    risk_levels: RiskLevelSettings = Field(default_factory=RiskLevelSettings)
    shelf_life: ShelfLifeSettings = Field(default_factory=ShelfLifeSettings)
    scoring_weights: ScoringWeights = Field(default_factory=ScoringWeights)
    redistribution_weights: RedistributionWeights = Field(default_factory=RedistributionWeights)


class MLSettingsUpdate(BaseModel):
    """Partial update model — all fields optional."""
    anomaly: Optional[AnomalySettings] = None
    forecast: Optional[ForecastSettings] = None
    risk_levels: Optional[RiskLevelSettings] = None
    shelf_life: Optional[ShelfLifeSettings] = None
    scoring_weights: Optional[ScoringWeights] = None
    redistribution_weights: Optional[RedistributionWeights] = None
