"""
Pydantic schemas for expiry risk intelligence endpoints.
"""

from pydantic import BaseModel, Field


class BloodUnit(BaseModel):
    """A single blood unit for expiry risk assessment."""
    unit_id: str
    blood_type: str
    days_until_expiry: int = Field(..., ge=0)
    component_type: str = Field(
        default="red_blood_cells",
        description="whole_blood | red_blood_cells | platelets | plasma_frozen | cryoprecipitate",
    )


class ExpiryRiskRequest(BaseModel):
    """Request body for expiry risk analysis."""
    hospital_id: str
    units: list[BloodUnit] = Field(..., min_length=1)
    avg_daily_usage_by_type: dict[str, float] = Field(
        default_factory=dict,
        description="Average daily usage keyed by blood type",
    )
    nearby_shortages: list[str] = Field(
        default_factory=list,
        description="Blood types with shortages at nearby hospitals",
    )


class UnitExpiryRisk(BaseModel):
    """Expiry risk assessment for a single unit."""
    unit_id: str
    blood_type: str
    days_until_expiry: int
    risk_score: float = Field(..., ge=0, le=1)
    risk_level: str = Field(..., description="critical | high | medium | low")
    action: str = Field(
        ...,
        description="Recommended action: use_immediately | redistribute | monitor | safe",
    )
    rationale: str


class ExpiryRiskResponse(BaseModel):
    """Response from expiry risk analysis."""
    hospital_id: str
    total_units: int
    at_risk_units: int
    critical_units: int
    assessments: list[UnitExpiryRisk]
    summary: str
