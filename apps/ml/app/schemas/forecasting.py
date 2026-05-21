"""
Pydantic schemas for demand forecasting endpoints.
"""

from pydantic import BaseModel, Field
from datetime import date


class ForecastRequest(BaseModel):
    """Request body for demand forecasting."""
    blood_type: str = Field(..., description="Blood type (e.g. O-, A+)")
    hospital_id: str = Field(..., description="Hospital identifier")
    historical_usage: list[float] = Field(
        ...,
        min_length=3,
        description="Historical daily usage values (most recent last)",
    )
    forecast_days: int = Field(
        default=7,
        ge=1,
        le=30,
        description="Number of days to forecast",
    )


class ForecastPoint(BaseModel):
    """A single forecast data point."""
    day: int = Field(..., description="Day offset from today (1 = tomorrow)")
    predicted_demand: float = Field(..., description="Predicted demand units")
    lower_bound: float = Field(..., description="Lower confidence bound")
    upper_bound: float = Field(..., description="Upper confidence bound")
    confidence: float = Field(..., ge=0, le=1, description="Confidence score")


class ForecastResponse(BaseModel):
    """Response from demand forecasting."""
    hospital_id: str
    blood_type: str
    forecast: list[ForecastPoint]
    method: str = Field(..., description="Algorithm used")
    trend: str = Field(..., description="Overall trend: rising, stable, declining")
    avg_confidence: float = Field(..., ge=0, le=1)
    data_points_used: int
