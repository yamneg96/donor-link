"""
Data preprocessing and cleaning utilities.
"""

import numpy as np
from typing import Sequence


def fill_missing_with_mean(values: Sequence[float | None]) -> list[float]:
    """Replace None values with the series mean."""
    valid = [v for v in values if v is not None]
    mean = np.mean(valid) if valid else 0.0
    return [v if v is not None else float(mean) for v in values]


def remove_outliers_iqr(values: Sequence[float], factor: float = 1.5) -> list[float]:
    """Remove outliers using IQR method."""
    arr = np.array(values, dtype=float)
    q1 = np.percentile(arr, 25)
    q3 = np.percentile(arr, 75)
    iqr = q3 - q1
    lower = q1 - factor * iqr
    upper = q3 + factor * iqr
    return [float(v) for v in arr if lower <= v <= upper]


def validate_numeric_series(values: list) -> list[float]:
    """Convert and validate a series to float, dropping non-numeric."""
    result = []
    for v in values:
        try:
            result.append(float(v))
        except (ValueError, TypeError):
            continue
    return result


def smooth_series(values: Sequence[float], alpha: float = 0.3) -> list[float]:
    """Exponential smoothing of a time series."""
    if not values:
        return []
    result = [float(values[0])]
    for v in values[1:]:
        result.append(alpha * float(v) + (1 - alpha) * result[-1])
    return result
