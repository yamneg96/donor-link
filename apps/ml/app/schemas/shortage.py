"""
Pydantic schemas for shortage risk scoring endpoints.
"""

from pydantic import BaseModel, Field


class ShortageRiskRequest(BaseModel):
    """Request body for shortage risk scoring."""
    hospital_id: str
    blood_type: str
    current_inventory: int = Field(..., ge=0)
    avg_daily_usage: float = Field(..., ge=0)
    pending_requests: int = Field(default=0, ge=0)
    incoming_transfers: int = Field(default=0, ge=0)
    emergency_active: bool = False
    days_horizon: int = Field(
        default=3,
        ge=1,
        le=14,
        description="Risk assessment horizon in days",
    )


class ShortageRiskResponse(BaseModel):
    """Response from shortage risk scoring."""
    hospital_id: str
    blood_type: str
    risk_score: float = Field(..., ge=0, le=1, description="Normalized risk score")
    risk_level: str = Field(..., description="critical | high | medium | low")
    days_of_supply: float = Field(..., description="Estimated days of supply remaining")
    projected_deficit: float = Field(
        ...,
        description="Projected unit deficit within horizon (negative = surplus)",
    )
    factors: dict[str, float] = Field(
        ...,
        description="Factor contributions to the risk score",
    )
    recommendation: str = Field(..., description="Action recommendation")
