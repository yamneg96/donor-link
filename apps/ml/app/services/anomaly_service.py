"""
Anomaly detection service — Z-score based.
Detects unusual blood usage spikes, abnormal consumption, emergency patterns.
"""

import numpy as np
from app.schemas.anomaly import (
    AnomalyRequest,
    AnomalyResponse,
    DetectedAnomaly,
)
from app.core.constants import DEFAULT_ANOMALY_THRESHOLD, CRITICAL_ANOMALY_THRESHOLD


class AnomalyService:
    """Z-score anomaly detection engine."""

    def detect_anomalies(self, request: AnomalyRequest) -> AnomalyResponse:
        """Detect anomalous values using z-score analysis."""
        values = np.array(request.values, dtype=float)
        threshold = request.threshold

        mean = float(values.mean())
        std = float(values.std())

        anomalies: list[DetectedAnomaly] = []

        if std > 0:
            z_scores = (values - mean) / std

            for i, (val, z) in enumerate(zip(values, z_scores)):
                abs_z = abs(float(z))
                if abs_z >= threshold:
                    # Determine severity
                    severity = (
                        "critical"
                        if abs_z >= CRITICAL_ANOMALY_THRESHOLD
                        else "warning"
                    )

                    # Percentage deviation from mean
                    dev_pct = (
                        ((float(val) - mean) / mean * 100)
                        if mean != 0
                        else 0.0
                    )

                    anomalies.append(
                        DetectedAnomaly(
                            index=i,
                            value=round(float(val), 2),
                            z_score=round(float(z), 3),
                            severity=severity,
                            deviation_pct=round(dev_pct, 1),
                        )
                    )

        # Sort by absolute z-score descending
        anomalies.sort(key=lambda a: abs(a.z_score), reverse=True)

        return AnomalyResponse(
            metric_name=request.metric_name,
            total_points=len(values),
            anomalies=anomalies,
            anomaly_count=len(anomalies),
            mean=round(mean, 2),
            std_dev=round(std, 3),
            threshold_used=threshold,
        )


# Singleton
anomaly_service = AnomalyService()
