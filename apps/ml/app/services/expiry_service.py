"""
Expiry risk intelligence service.
Assesses blood unit expiry risk and recommends actions.
"""

from app.schemas.expiry import (
    ExpiryRiskRequest,
    ExpiryRiskResponse,
    UnitExpiryRisk,
)
from app.core.constants import SHELF_LIFE, RISK_LEVELS
from app.utils.metrics import clamp


class ExpiryService:
    """Blood unit expiry risk assessment engine."""

    def assess_expiry_risk(self, request: ExpiryRiskRequest) -> ExpiryRiskResponse:
        """Evaluate expiry risk for all units and recommend actions."""
        assessments: list[UnitExpiryRisk] = []
        at_risk = 0
        critical = 0

        for unit in request.units:
            risk = self._assess_unit(
                unit_id=unit.unit_id,
                blood_type=unit.blood_type,
                days_until_expiry=unit.days_until_expiry,
                component_type=unit.component_type,
                avg_usage=request.avg_daily_usage_by_type.get(unit.blood_type, 0),
                nearby_shortages=request.nearby_shortages,
            )
            assessments.append(risk)

            if risk.risk_level in ("critical", "high"):
                at_risk += 1
            if risk.risk_level == "critical":
                critical += 1

        # Sort by risk score descending
        assessments.sort(key=lambda a: a.risk_score, reverse=True)

        # Build summary
        total = len(request.units)
        summary = self._build_summary(total, at_risk, critical)

        return ExpiryRiskResponse(
            hospital_id=request.hospital_id,
            total_units=total,
            at_risk_units=at_risk,
            critical_units=critical,
            assessments=assessments,
            summary=summary,
        )

    def _assess_unit(
        self,
        unit_id: str,
        blood_type: str,
        days_until_expiry: int,
        component_type: str,
        avg_usage: float,
        nearby_shortages: list[str],
    ) -> UnitExpiryRisk:
        """Assess a single blood unit's expiry risk."""
        # Get shelf life for component type
        max_shelf = SHELF_LIFE.get(component_type, 42)
        life_remaining_pct = days_until_expiry / max_shelf if max_shelf > 0 else 0

        # ── Risk factors ─────────────────────────────────
        # Time factor: how close to expiry
        if days_until_expiry <= 1:
            time_risk = 1.0
        elif days_until_expiry <= 3:
            time_risk = 0.9
        elif days_until_expiry <= 7:
            time_risk = 0.7
        elif days_until_expiry <= 14:
            time_risk = 0.4
        else:
            time_risk = clamp(1.0 - life_remaining_pct)

        # Demand factor: will it likely be used?
        if avg_usage > 0:
            # If usage is high relative to expiry, less risk (it will get used)
            usage_coverage = avg_usage * days_until_expiry
            demand_risk = clamp(1.0 - (usage_coverage / max(1, avg_usage * 7)))
        else:
            demand_risk = 0.8  # Low usage = higher expiry risk

        # Redistribution opportunity
        can_redistribute = blood_type in nearby_shortages
        redistribution_bonus = -0.2 if can_redistribute else 0.0

        # ── Combined risk score ──────────────────────────
        risk_score = clamp(
            time_risk * 0.6 + demand_risk * 0.4 + redistribution_bonus
        )

        # ── Risk level ───────────────────────────────────
        risk_level = "low"
        for level, (low, high) in RISK_LEVELS.items():
            if low <= risk_score <= high:
                risk_level = level
                break

        # ── Action recommendation ────────────────────────
        if risk_score >= 0.8:
            action = "use_immediately"
        elif risk_score >= 0.6:
            action = "redistribute" if can_redistribute else "use_immediately"
        elif risk_score >= 0.3:
            action = "monitor"
        else:
            action = "safe"

        # ── Rationale ────────────────────────────────────
        rationale = self._build_unit_rationale(
            days_until_expiry, component_type, risk_level, can_redistribute, avg_usage
        )

        return UnitExpiryRisk(
            unit_id=unit_id,
            blood_type=blood_type,
            days_until_expiry=days_until_expiry,
            risk_score=round(risk_score, 3),
            risk_level=risk_level,
            action=action,
            rationale=rationale,
        )

    def _build_unit_rationale(
        self,
        days: int,
        component: str,
        level: str,
        can_redistribute: bool,
        usage: float,
    ) -> str:
        parts = []
        if days <= 3:
            parts.append(f"Expires in {days} day(s) — immediate action required")
        elif days <= 7:
            parts.append(f"Expiring within a week ({days} days)")
        else:
            parts.append(f"{days} days until expiry")

        if can_redistribute:
            parts.append("nearby hospitals have shortages — redistribution recommended")
        if usage < 0.5:
            parts.append("low local demand increases wastage risk")

        return "; ".join(parts)

    def _build_summary(self, total: int, at_risk: int, critical: int) -> str:
        if critical > 0:
            return (
                f"{critical} of {total} units critically close to expiry. "
                f"{at_risk} total units at risk. Immediate action required."
            )
        elif at_risk > 0:
            return (
                f"{at_risk} of {total} units at elevated expiry risk. "
                f"Consider redistribution or prioritized usage."
            )
        else:
            return f"All {total} units within safe expiry range."


# Singleton
expiry_service = ExpiryService()
