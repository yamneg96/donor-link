"""
Redistribution recommendation service.
Ranks candidate hospitals for blood redistribution using weighted scoring.
"""

from app.schemas.recommendations import (
    RedistributionRequest,
    RedistributionResponse,
    RecommendationScore,
    HospitalInventory,
)
from app.utils.metrics import clamp, normalize_min_max


class RecommendationService:
    """Weighted redistribution recommendation engine."""

    # Weight vectors for scoring
    WEIGHTS = {
        "availability": 0.35,
        "proximity": 0.25,
        "expiry_risk": 0.20,
        "surplus": 0.20,
    }

    # Urgency multipliers
    URGENCY_MULTIPLIERS = {
        "normal": 1.0,
        "high": 1.3,
        "critical": 1.6,
    }

    def recommend_redistribution(
        self, request: RedistributionRequest
    ) -> RedistributionResponse:
        """Score and rank candidate hospitals for redistribution."""
        candidates = request.candidate_hospitals
        units_needed = request.units_needed
        urgency_mult = self.URGENCY_MULTIPLIERS.get(request.urgency, 1.0)

        # Collect ranges for normalization
        distances = [c.distance_km for c in candidates]
        max_dist = max(distances) if distances else 1.0
        min_dist = min(distances) if distances else 0.0

        scored: list[RecommendationScore] = []

        for hospital in candidates:
            factors = self._score_candidate(
                hospital, units_needed, min_dist, max_dist, urgency_mult
            )
            overall = sum(self.WEIGHTS[k] * factors[k] for k in self.WEIGHTS)
            overall = clamp(overall)

            # Determine recommended units (don't take more than surplus)
            surplus = max(
                0,
                hospital.available_units
                - int(hospital.avg_daily_usage * 2),  # keep 2 days minimum
            )
            recommended = min(surplus, units_needed)

            # Build rationale
            rationale = self._build_rationale(hospital, factors, recommended)

            scored.append(
                RecommendationScore(
                    hospital_id=hospital.hospital_id,
                    hospital_name=hospital.hospital_name,
                    overall_score=round(overall, 3),
                    recommended_units=recommended,
                    factors={k: round(v, 3) for k, v in factors.items()},
                    rationale=rationale,
                )
            )

        # Sort by overall score descending
        scored.sort(key=lambda s: s.overall_score, reverse=True)

        # Calculate fulfillment percentage
        total_available = sum(s.recommended_units for s in scored)
        fulfillment = min(100.0, (total_available / units_needed * 100) if units_needed > 0 else 100.0)

        return RedistributionResponse(
            target_hospital_id=request.target_hospital_id,
            blood_type=request.blood_type,
            units_needed=units_needed,
            recommendations=scored,
            fulfillment_pct=round(fulfillment, 1),
        )

    def _score_candidate(
        self,
        hospital: HospitalInventory,
        units_needed: int,
        min_dist: float,
        max_dist: float,
        urgency_mult: float,
    ) -> dict[str, float]:
        """Score a single candidate hospital on all factors."""

        # Availability: can they provide what's needed?
        if units_needed > 0:
            availability = clamp(hospital.available_units / (units_needed * 2))
        else:
            availability = 0.5

        # Proximity: closer is better (inverted)
        proximity = 1.0 - normalize_min_max(hospital.distance_km, min_dist, max_dist)

        # Expiry risk: units expiring soon should be redistributed (higher = better to take)
        if hospital.days_until_nearest_expiry <= 3:
            expiry_risk = 0.95  # Very close to expiry — high priority to move
        elif hospital.days_until_nearest_expiry <= 7:
            expiry_risk = 0.7
        elif hospital.days_until_nearest_expiry <= 14:
            expiry_risk = 0.4
        else:
            expiry_risk = 0.2

        # Surplus: how much excess do they have?
        min_stock = hospital.avg_daily_usage * 2  # 2-day minimum
        excess = hospital.available_units - min_stock
        surplus = clamp(excess / max(units_needed, 1))

        # Apply urgency multiplier to availability and surplus
        availability = clamp(availability * urgency_mult)
        surplus = clamp(surplus * urgency_mult)

        return {
            "availability": availability,
            "proximity": proximity,
            "expiry_risk": expiry_risk,
            "surplus": surplus,
        }

    def _build_rationale(
        self,
        hospital: HospitalInventory,
        factors: dict[str, float],
        recommended_units: int,
    ) -> str:
        """Generate human-readable rationale."""
        parts = []

        if recommended_units > 0:
            parts.append(f"Can supply {recommended_units} units")
        else:
            parts.append("Insufficient surplus to safely redistribute")

        if factors["proximity"] > 0.7:
            parts.append("very close proximity")
        elif factors["proximity"] > 0.4:
            parts.append(f"{hospital.distance_km:.0f}km away")

        if factors["expiry_risk"] > 0.7:
            parts.append(
                f"units nearing expiry ({hospital.days_until_nearest_expiry}d remaining)"
            )

        if factors["surplus"] > 0.6:
            parts.append("significant surplus available")

        return "; ".join(parts) if parts else "Standard candidate"


# Singleton
recommendation_service = RecommendationService()
