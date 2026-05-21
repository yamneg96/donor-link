"""
Pydantic schemas for redistribution recommendation endpoints.
"""

from pydantic import BaseModel, Field


class HospitalInventory(BaseModel):
    """Inventory snapshot of a candidate hospital."""
    hospital_id: str
    hospital_name: str = ""
    blood_type: str
    available_units: int = Field(..., ge=0)
    avg_daily_usage: float = Field(default=0, ge=0)
    distance_km: float = Field(default=0, ge=0, description="Distance to target")
    days_until_nearest_expiry: float = Field(default=30, ge=0)
    emergency_active: bool = False


class RedistributionRequest(BaseModel):
    """Request for redistribution recommendations."""
    target_hospital_id: str
    target_hospital_name: str = ""
    blood_type: str
    units_needed: int = Field(..., ge=1)
    urgency: str = Field(default="normal", description="normal | high | critical")
    candidate_hospitals: list[HospitalInventory] = Field(..., min_length=1)


class RecommendationScore(BaseModel):
    """A scored redistribution recommendation."""
    hospital_id: str
    hospital_name: str
    overall_score: float = Field(..., ge=0, le=1)
    recommended_units: int
    factors: dict[str, float] = Field(
        ...,
        description="Factor breakdown: availability, proximity, expiry_risk, surplus",
    )
    rationale: str = Field(..., description="Human-readable explanation")


class RedistributionResponse(BaseModel):
    """Response with ranked redistribution recommendations."""
    target_hospital_id: str
    blood_type: str
    units_needed: int
    recommendations: list[RecommendationScore]
    fulfillment_pct: float = Field(
        ..., ge=0, le=100,
        description="Percentage of needed units covered by recommendations",
    )
