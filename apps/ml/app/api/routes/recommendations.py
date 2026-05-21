"""
Redistribution recommendation API routes.
"""

from fastapi import APIRouter, Depends
from app.schemas.recommendations import RedistributionRequest, RedistributionResponse
from app.services.recommendation_service import recommendation_service
from app.api.dependencies import require_auth
from app.core.logging import get_logger

router = APIRouter(prefix="/recommendations", tags=["Recommendations"])
logger = get_logger("routes.recommendations")


@router.post("/redistribution", response_model=RedistributionResponse)
async def recommend_redistribution(
    request: RedistributionRequest,
    _auth: str = Depends(require_auth),
):
    """
    Recommend blood redistribution sources for a target hospital.

    Ranks candidate hospitals by: availability, proximity, expiry risk,
    surplus. Returns ranked list with explainable factor breakdowns
    and fulfillment percentage.
    """
    logger.info(
        f"Redistribution recommendation: target={request.target_hospital_id}, "
        f"type={request.blood_type}, needed={request.units_needed}, "
        f"candidates={len(request.candidate_hospitals)}"
    )

    result = recommendation_service.recommend_redistribution(request)

    logger.info(
        f"Recommendations generated: {len(result.recommendations)} candidates, "
        f"fulfillment={result.fulfillment_pct}%"
    )
    return result
