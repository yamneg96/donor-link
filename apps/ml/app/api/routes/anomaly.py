"""
Anomaly detection API routes.
"""

from fastapi import APIRouter, Depends
from app.schemas.anomaly import AnomalyRequest, AnomalyResponse
from app.services.anomaly_service import anomaly_service
from app.api.dependencies import require_auth
from app.core.logging import get_logger

router = APIRouter(prefix="/anomaly", tags=["Anomaly Detection"])
logger = get_logger("routes.anomaly")


@router.post("/detect", response_model=AnomalyResponse)
async def detect_anomalies(
    request: AnomalyRequest,
    _auth: str = Depends(require_auth),
):
    """
    Detect anomalous values in a metric series using z-score analysis.

    Use for: unusual blood usage spikes, suspicious activity,
    abnormal consumption patterns, wastage detection.

    **Threshold**: z > 2.0 = warning, z > 3.0 = critical (configurable).
    """
    logger.info(
        f"Anomaly detection: metric={request.metric_name}, "
        f"points={len(request.values)}, threshold={request.threshold}"
    )

    result = anomaly_service.detect_anomalies(request)

    logger.info(
        f"Detection complete: {result.anomaly_count} anomalies found "
        f"(mean={result.mean}, std={result.std_dev})"
    )
    return result
