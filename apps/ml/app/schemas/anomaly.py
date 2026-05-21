"""
Pydantic schemas for anomaly detection endpoints.
"""

from pydantic import BaseModel, Field


class AnomalyRequest(BaseModel):
    """Request body for anomaly detection."""
    metric_name: str = Field(..., description="Name of the metric being analyzed")
    values: list[float] = Field(
        ...,
        min_length=3,
        description="Ordered metric values to analyze",
    )
    threshold: float = Field(
        default=2.0,
        gt=0,
        description="Z-score threshold for anomaly flagging",
    )
    context: dict | None = Field(
        default=None,
        description="Optional context (hospital_id, blood_type, etc.)",
    )


class DetectedAnomaly(BaseModel):
    """A single detected anomaly."""
    index: int = Field(..., description="Position in the values array")
    value: float = Field(..., description="The anomalous value")
    z_score: float = Field(..., description="Z-score of this value")
    severity: str = Field(..., description="warning | critical")
    deviation_pct: float = Field(..., description="Percent deviation from mean")


class AnomalyResponse(BaseModel):
    """Response from anomaly detection."""
    metric_name: str
    total_points: int
    anomalies: list[DetectedAnomaly]
    anomaly_count: int
    mean: float
    std_dev: float
    threshold_used: float
