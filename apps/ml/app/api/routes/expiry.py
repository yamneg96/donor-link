"""
Expiry risk intelligence API routes.
"""

from fastapi import APIRouter, Depends
from app.schemas.expiry import ExpiryRiskRequest, ExpiryRiskResponse
from app.services.expiry_service import expiry_service
from app.api.dependencies import require_auth
from app.core.logging import get_logger

router = APIRouter(prefix="/expiry", tags=["Expiry Intelligence"])
logger = get_logger("routes.expiry")


@router.post("/risk", response_model=ExpiryRiskResponse)
async def assess_expiry_risk(
    request: ExpiryRiskRequest,
    _auth: str = Depends(require_auth),
):
    """
    Assess expiry risk for blood units at a hospital.

    Evaluates each unit based on: time until expiry, component shelf life,
    local demand, nearby shortages. Returns per-unit risk scores with
    recommended actions (use_immediately, redistribute, monitor, safe).
    """
    logger.info(
        f"Expiry risk assessment: hospital={request.hospital_id}, "
        f"units={len(request.units)}"
    )

    result = expiry_service.assess_expiry_risk(request)

    logger.info(
        f"Assessment complete: {result.at_risk_units} at risk, "
        f"{result.critical_units} critical of {result.total_units} total"
    )
    return result
