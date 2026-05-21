"""
Preprocessing service — data validation and normalization for incoming requests.
"""

import numpy as np
from app.utils.preprocessing import (
    fill_missing_with_mean,
    validate_numeric_series,
    smooth_series,
)


class PreprocessingService:
    """Data preprocessing pipeline for ML inputs."""

    def prepare_time_series(
        self,
        values: list[float],
        min_points: int = 3,
        smooth: bool = False,
        smooth_alpha: float = 0.3,
    ) -> list[float]:
        """
        Validate and prepare a time series for analysis.
        - Validates numeric values
        - Fills missing with mean
        - Optional exponential smoothing
        """
        cleaned = validate_numeric_series(values)

        if len(cleaned) < min_points:
            # Pad with mean if too few points
            mean_val = np.mean(cleaned) if cleaned else 0.0
            while len(cleaned) < min_points:
                cleaned.insert(0, float(mean_val))

        if smooth:
            cleaned = smooth_series(cleaned, alpha=smooth_alpha)

        return cleaned

    def normalize_features(
        self, features: dict[str, float]
    ) -> dict[str, float]:
        """Normalize a feature dictionary to 0-1 range."""
        if not features:
            return {}

        vals = list(features.values())
        min_v = min(vals)
        max_v = max(vals)
        rng = max_v - min_v

        if rng == 0:
            return {k: 0.5 for k in features}

        return {k: (v - min_v) / rng for k, v in features.items()}


# Singleton
preprocessing_service = PreprocessingService()
