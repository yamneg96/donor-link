"""
Weighted scoring service — shortage risk and emergency prioritization.
Deterministic, explainable, no training required.
"""

from app.schemas.shortage import ShortageRiskRequest, ShortageRiskResponse
from app.utils.metrics import clamp
from app.core.constants import RISK_LEVELS


class ScoringService:
    """Weighted scoring engine for shortage risk assessment."""

    # ── Default weights (sum to 1.0) ─────────────────
    WEIGHTS = {
        "inventory_ratio": 0.30,
        "demand_pressure": 0.25,
        "pending_requests": 0.15,
        "emergency_factor": 0.15,
        "supply_coverage": 0.15,
    }

    def score_shortage_risk(self, request: ShortageRiskRequest) -> ShortageRiskResponse:
        """Calculate weighted shortage risk score."""
        inv = request.current_inventory
        usage = request.avg_daily_usage
        pending = request.pending_requests
        incoming = request.incoming_transfers
        emergency = request.emergency_active
        horizon = request.days_horizon

        # ── Days of supply ───────────────────────────────
        days_of_supply = inv / usage if usage > 0 else 999.0

        # ── Projected deficit ────────────────────────────
        projected_demand = (usage * horizon) + pending
        projected_supply = inv + incoming
        projected_deficit = projected_demand - projected_supply

        # ── Factor scores (0 = no risk, 1 = max risk) ───

        # 1. Inventory ratio: how low is stock relative to usage
        if usage > 0:
            inv_ratio_score = clamp(1.0 - (inv / (usage * 7)))  # 7-day benchmark
        else:
            inv_ratio_score = 0.0 if inv > 0 else 1.0

        # 2. Demand pressure: projected demand vs supply
        if projected_supply > 0:
            demand_pressure = clamp(projected_deficit / projected_supply)
        else:
            demand_pressure = 1.0 if projected_demand > 0 else 0.0

        # 3. Pending request pressure
        if inv > 0:
            pending_score = clamp(pending / inv)
        else:
            pending_score = 1.0 if pending > 0 else 0.0

        # 4. Emergency multiplier
        emergency_score = 1.0 if emergency else 0.0

        # 5. Supply coverage within horizon
        if projected_demand > 0:
            coverage = clamp(1.0 - (projected_supply / projected_demand))
        else:
            coverage = 0.0

        # ── Weighted combination ─────────────────────────
        factors = {
            "inventory_ratio": round(inv_ratio_score, 3),
            "demand_pressure": round(demand_pressure, 3),
            "pending_requests": round(pending_score, 3),
            "emergency_factor": round(emergency_score, 3),
            "supply_coverage": round(coverage, 3),
        }

        risk_score = sum(
            self.WEIGHTS[k] * factors[k] for k in self.WEIGHTS
        )
        risk_score = clamp(risk_score)

        # ── Determine risk level ─────────────────────────
        risk_level = "low"
        for level, (low, high) in RISK_LEVELS.items():
            if low <= risk_score <= high:
                risk_level = level
                break

        # ── Recommendation ───────────────────────────────
        recommendations = {
            "critical": "URGENT: Initiate emergency redistribution and donor mobilization immediately",
            "high": "Request emergency transfer from nearby facilities with surplus",
            "medium": "Monitor closely and pre-arrange transfer agreements",
            "low": "Stock levels adequate — continue routine monitoring",
        }

        return ShortageRiskResponse(
            hospital_id=request.hospital_id,
            blood_type=request.blood_type,
            risk_score=round(risk_score, 3),
            risk_level=risk_level,
            days_of_supply=round(days_of_supply, 1),
            projected_deficit=round(projected_deficit, 1),
            factors=factors,
            recommendation=recommendations[risk_level],
        )


# Singleton
scoring_service = ScoringService()
