"""
Structured logging configuration for the ML service.
"""

import logging
import sys
from app.core.config import get_settings


def setup_logging() -> logging.Logger:
    """Configure and return the application logger."""
    settings = get_settings()

    logger = logging.getLogger("donorlink_ml")
    logger.setLevel(getattr(logging, settings.log_level.upper(), logging.INFO))

    if not logger.handlers:
        handler = logging.StreamHandler(sys.stdout)
        formatter = logging.Formatter(
            fmt="%(asctime)s | %(levelname)-8s | %(name)s | %(message)s",
            datefmt="%Y-%m-%d %H:%M:%S",
        )
        handler.setFormatter(formatter)
        logger.addHandler(handler)

    return logger


def get_logger(name: str = "donorlink_ml") -> logging.Logger:
    """Get a child logger with the given name."""
    return logging.getLogger(f"donorlink_ml.{name}")
