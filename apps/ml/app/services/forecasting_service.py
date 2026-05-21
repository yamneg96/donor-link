"""
Demand forecasting service — Phase 1 statistical methods.
Uses moving averages, linear regression, and day-of-week seasonality.
No trained models required.
"""

import numpy as np
from app.schemas.forecasting import (
    ForecastRequest,
    ForecastResponse,
    ForecastPoint,
)
from app.utils.metrics import (
    moving_average,
    weighted_moving_average,
    linear_regression,
    coefficient_of_variation,
    clamp,
)
from app.utils.feature_engineering import compute_trend_features, day_of_week_pattern
from app.core.constants import MIN_HISTORICAL_POINTS


class ForecastingService:
    """Statistical demand forecasting engine."""

    def forecast_demand(self, request: ForecastRequest) -> ForecastResponse:
        """Generate demand forecast using ensemble of statistical methods."""
        values = request.historical_usage
        n = len(values)
        horizon = request.forecast_days

        # ── Compute base forecasts ───────────────────────────
        # 1. Short-term moving average (most recent window)
        window_short = min(7, n)
        ma_short = moving_average(values, window_short)
        short_forecast = ma_short[-1] if ma_short else np.mean(values)

        # 2. Weighted moving average (emphasizes recent)
        wma = weighted_moving_average(values, min(14, n))
        wma_forecast = wma[-1] if wma else np.mean(values)

        # 3. Linear trend projection
        slope, intercept = linear_regression(values)
        trend_forecasts = [slope * (n + i) + intercept for i in range(horizon)]

        # 4. Day-of-week seasonality
        dow_pattern = day_of_week_pattern(values)

        # ── Ensemble combination ─────────────────────────────
        trend_features = compute_trend_features(values)
        cv = coefficient_of_variation(values)

        # Weight allocation based on data consistency
        if cv < 0.3:  # Consistent data → trust trend more
            w_short, w_wma, w_trend = 0.3, 0.3, 0.4
        elif cv < 0.6:  # Moderate variability
            w_short, w_wma, w_trend = 0.4, 0.35, 0.25
        else:  # High variability → trust averages
            w_short, w_wma, w_trend = 0.45, 0.4, 0.15

        # ── Generate forecast points ─────────────────────────
        std = float(np.std(values))
        mean = float(np.mean(values))
        forecast_points = []

        for i in range(horizon):
            # Ensemble prediction
            trend_pred = max(0, trend_forecasts[i])
            dow_adj = dow_pattern[(n + i) % 7] / mean if mean > 0 else 1.0

            base_pred = (
                w_short * short_forecast
                + w_wma * wma_forecast
                + w_trend * trend_pred
            )
            # Apply seasonality adjustment
            predicted = max(0, base_pred * dow_adj)

            # Confidence degrades with forecast horizon
            base_confidence = clamp(1.0 - cv * 0.5, 0.3, 0.95)
            horizon_decay = 1.0 - (i * 0.03)
            confidence = clamp(base_confidence * horizon_decay, 0.1, 0.95)

            # Confidence interval
            margin = std * (1.5 + i * 0.1)

            forecast_points.append(
                ForecastPoint(
                    day=i + 1,
                    predicted_demand=round(predicted, 2),
                    lower_bound=round(max(0, predicted - margin), 2),
                    upper_bound=round(predicted + margin, 2),
                    confidence=round(confidence, 3),
                )
            )

        # ── Determine overall trend ──────────────────────────
        if slope > 0.3:
            trend = "rising"
        elif slope < -0.3:
            trend = "declining"
        else:
            trend = "stable"

        avg_conf = np.mean([p.confidence for p in forecast_points])

        return ForecastResponse(
            hospital_id=request.hospital_id,
            blood_type=request.blood_type,
            forecast=forecast_points,
            method="ensemble_statistical",
            trend=trend,
            avg_confidence=round(float(avg_conf), 3),
            data_points_used=n,
        )


# Singleton
forecasting_service = ForecastingService()
