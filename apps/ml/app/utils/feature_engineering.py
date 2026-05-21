"""
Feature engineering helpers for time-series data.
"""

import numpy as np
from typing import Sequence


def compute_trend_features(values: Sequence[float]) -> dict:
    """Extract trend features from a time series."""
    arr = np.array(values, dtype=float)
    n = len(arr)

    if n < 2:
        return {
            "mean": float(arr[0]) if n > 0 else 0.0,
            "std": 0.0,
            "trend_slope": 0.0,
            "recent_vs_historical": 0.0,
            "volatility": 0.0,
        }

    # Basic statistics
    mean = float(arr.mean())
    std = float(arr.std())

    # Trend slope via linear regression
    x = np.arange(n, dtype=float)
    x_mean = x.mean()
    y_mean = arr.mean()
    slope_num = np.sum((x - x_mean) * (arr - y_mean))
    slope_den = np.sum((x - x_mean) ** 2)
    trend_slope = float(slope_num / slope_den) if slope_den != 0 else 0.0

    # Recent vs historical average
    split = max(1, n // 3)
    recent_mean = float(arr[-split:].mean())
    historical_mean = float(arr[:-split].mean()) if n > split else mean
    recent_vs = (
        (recent_mean - historical_mean) / historical_mean
        if historical_mean != 0
        else 0.0
    )

    # Volatility (coefficient of variation)
    volatility = std / abs(mean) if mean != 0 else 0.0

    return {
        "mean": mean,
        "std": std,
        "trend_slope": trend_slope,
        "recent_vs_historical": float(recent_vs),
        "volatility": float(volatility),
    }


def day_of_week_pattern(values: Sequence[float]) -> list[float]:
    """
    Estimate day-of-week seasonality from values.
    Assumes values are sequential daily observations.
    Returns 7 values representing average for each weekday index.
    """
    arr = np.array(values, dtype=float)
    n = len(arr)
    if n < 7:
        return [float(arr.mean())] * 7

    day_sums = [0.0] * 7
    day_counts = [0] * 7
    for i, v in enumerate(arr):
        day_idx = i % 7
        day_sums[day_idx] += v
        day_counts[day_idx] += 1

    return [
        day_sums[d] / day_counts[d] if day_counts[d] > 0 else 0.0
        for d in range(7)
    ]
