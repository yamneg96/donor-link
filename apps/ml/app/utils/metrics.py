"""
Statistical helper functions used across intelligence services.
No external ML libraries — pure numpy + math.
"""

import numpy as np
from typing import Sequence


def moving_average(values: Sequence[float], window: int) -> list[float]:
    """Calculate simple moving average with the given window size."""
    arr = np.array(values, dtype=float)
    if len(arr) < window:
        window = len(arr)
    weights = np.ones(window) / window
    ma = np.convolve(arr, weights, mode="valid")
    return ma.tolist()


def weighted_moving_average(values: Sequence[float], window: int) -> list[float]:
    """Calculate weighted moving average — recent values weighted more heavily."""
    arr = np.array(values, dtype=float)
    if len(arr) < window:
        window = len(arr)
    weights = np.arange(1, window + 1, dtype=float)
    weights /= weights.sum()
    wma = np.convolve(arr, weights[::-1], mode="valid")
    return wma.tolist()


def linear_regression(values: Sequence[float]) -> tuple[float, float]:
    """
    Simple linear regression: y = slope * x + intercept.
    Returns (slope, intercept).
    """
    n = len(values)
    if n < 2:
        return 0.0, float(values[0]) if values else 0.0
    x = np.arange(n, dtype=float)
    y = np.array(values, dtype=float)
    x_mean = x.mean()
    y_mean = y.mean()
    numerator = np.sum((x - x_mean) * (y - y_mean))
    denominator = np.sum((x - x_mean) ** 2)
    if denominator == 0:
        return 0.0, y_mean
    slope = numerator / denominator
    intercept = y_mean - slope * x_mean
    return float(slope), float(intercept)


def z_score(value: float, mean: float, std: float) -> float:
    """Calculate z-score of a single value."""
    if std == 0:
        return 0.0
    return (value - mean) / std


def z_scores(values: Sequence[float]) -> list[float]:
    """Calculate z-scores for an array of values."""
    arr = np.array(values, dtype=float)
    mean = arr.mean()
    std = arr.std()
    if std == 0:
        return [0.0] * len(arr)
    return ((arr - mean) / std).tolist()


def coefficient_of_variation(values: Sequence[float]) -> float:
    """CV = std / mean — measures data consistency (lower = more consistent)."""
    arr = np.array(values, dtype=float)
    mean = arr.mean()
    if mean == 0:
        return float("inf")
    return float(arr.std() / abs(mean))


def percentile(values: Sequence[float], p: float) -> float:
    """Calculate the p-th percentile of values."""
    return float(np.percentile(values, p))


def clamp(value: float, min_val: float = 0.0, max_val: float = 1.0) -> float:
    """Clamp value to [min_val, max_val]."""
    return max(min_val, min(max_val, value))


def normalize_min_max(
    value: float, min_val: float, max_val: float
) -> float:
    """Min-max normalize a value to [0, 1]."""
    if max_val == min_val:
        return 0.5
    return clamp((value - min_val) / (max_val - min_val))
