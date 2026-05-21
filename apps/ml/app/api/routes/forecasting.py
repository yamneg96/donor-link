"""
Demand forecasting API routes.
"""

from fastapi import APIRouter, Depends
from app.schemas.forecasting import ForecastRequest, ForecastResponse
from app.services.forecasting_service import forecasting_service
from app.api.dependencies import require_auth
from app.core.logging import get_logger

router = APIRouter(prefix="/forecast", tags=["Forecasting"])
logger = get_logger("routes.forecasting")


@router.post("/demand", response_model=ForecastResponse)
async def forecast_demand(
    request: ForecastRequest,
    _auth: str = Depends(require_auth),
):
    """
    Forecast blood demand for a hospital and blood type.

    Uses ensemble statistical methods (moving averages, linear regression,
    day-of-week seasonality). No trained model required.

    **Input**: historical daily usage values (minimum 3 data points).
    **Output**: forecasted demand per day with confidence intervals.
    """
    logger.info(
        f"Forecasting demand: hospital={request.hospital_id}, "
        f"type={request.blood_type}, days={request.forecast_days}"
    )

    result = forecasting_service.forecast_demand(request)

    logger.info(
        f"Forecast complete: trend={result.trend}, "
        f"avg_confidence={result.avg_confidence}"
    )
    return result
