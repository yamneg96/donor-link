"""
Domain constants for blood logistics intelligence.
"""

# ── Blood Types ──────────────────────────────────────
BLOOD_TYPES = ["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"]

# Blood type compatibility matrix (recipient → compatible donors)
COMPATIBILITY = {
    "O-":  ["O-"],
    "O+":  ["O-", "O+"],
    "A-":  ["O-", "A-"],
    "A+":  ["O-", "O+", "A-", "A+"],
    "B-":  ["O-", "B-"],
    "B+":  ["O-", "O+", "B-", "B+"],
    "AB-": ["O-", "A-", "B-", "AB-"],
    "AB+": BLOOD_TYPES,  # universal recipient
}

# ── Shelf Life (days) ────────────────────────────────
SHELF_LIFE = {
    "whole_blood": 35,
    "red_blood_cells": 42,
    "platelets": 5,
    "plasma_frozen": 365,
    "cryoprecipitate": 365,
}

# ── Risk Levels ──────────────────────────────────────
RISK_LEVELS = {
    "critical": (0.8, 1.0),
    "high": (0.6, 0.8),
    "medium": (0.3, 0.6),
    "low": (0.0, 0.3),
}

# ── Anomaly Thresholds ───────────────────────────────
DEFAULT_ANOMALY_THRESHOLD = 2.0
CRITICAL_ANOMALY_THRESHOLD = 3.0

# ── Forecast Defaults ────────────────────────────────
DEFAULT_FORECAST_DAYS = 7
MAX_FORECAST_DAYS = 30
MIN_HISTORICAL_POINTS = 3
