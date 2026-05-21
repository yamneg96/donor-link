"""
Scoring API routes — shortage risk assessment.
"""

from fastapi import APIRouter, Depends
from app.schemas.shortage import ShortageRiskRequest, ShortageRiskResponse
from app.services.scoring_service import scoring_service
from app.api.dependencies import require_auth
from app.core.logging import get_logger

router = APIRouter(prefix="/scoring", tags=["Scoring"])
logger = get_logger("routes.scoring")


@router.post("/shortage-risk", response_model=ShortageRiskResponse)
async def score_shortage_risk(
    request: ShortageRiskRequest,
    _auth: str = Depends(require_auth),
):
    """
    Calculate shortage risk score for a hospital and blood type.

    Weighted factors: inventory ratio, demand pressure, pending requests,
    emergency status, supply coverage. Returns 0–1 risk score with
    factor breakdown and action recommendation.
    """
    logger.info(
        f"Scoring shortage risk: hospital={request.hospital_id}, "
        f"type={request.blood_type}, inventory={request.current_inventory}"
    )

    result = scoring_service.score_shortage_risk(request)

    logger.info(
        f"Risk scored: {result.risk_level} ({result.risk_score}), "
        f"days_supply={result.days_of_supply}"
    )
    return result
