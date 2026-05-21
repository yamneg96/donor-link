# DonorLink ML Intelligence Service

**Computational intelligence microservice** for the DonorLink national blood logistics platform.

Built with **Python/FastAPI** — runs as an independent microservice alongside the Node.js/Express backend.

## Architecture

```
React Frontend → Express API → FastAPI ML Service → Intelligence Response → Express → Frontend
```

## Intelligence Engines

| Engine | Endpoint | Algorithm | Purpose |
|--------|----------|-----------|---------|
| Demand Forecasting | `POST /forecast/demand` | Statistical ensemble (MA + LR + seasonality) | Predict blood demand |
| Anomaly Detection | `POST /anomaly/detect` | Z-score analysis | Detect unusual usage/activity |
| Shortage Risk | `POST /scoring/shortage-risk` | Weighted scoring (5 factors) | Assess shortage risk |
| Redistribution | `POST /recommendations/redistribution` | Weighted ranking | Recommend blood transfers |
| Expiry Intelligence | `POST /expiry/risk` | Rule engine | Assess unit expiry risk |
| Health Check | `GET /health` | — | Service status |

## Quick Start

```bash
# 1. Create virtual environment
python -m venv .venv

# 2. Activate (Windows)
.venv\Scripts\activate

# 3. Install dependencies
pip install -r requirements.txt

# 4. Start dev server
uvicorn app.main:app --reload --port 8000
```

**Swagger docs**: http://localhost:8000/docs

## Project Structure

```
app/
├── api/routes/         # FastAPI route handlers
├── core/               # Config, logging, security, constants
├── schemas/            # Pydantic request/response models
├── services/           # Intelligence engine implementations
├── utils/              # Statistical helpers, preprocessing
├── models/             # Trained model artifacts (Phase 2+)
├── training/           # Training pipelines (Phase 2+)
└── main.py             # FastAPI entry point
```

## ML Phases

- **Phase 1 (Current)**: Statistical methods — z-score, weighted scoring, moving averages, rule engines
- **Phase 2**: XGBoost, Prophet, Isolation Forest — requires historical data
- **Phase 3**: Deep learning, graph networks, reinforcement learning

## Environment Variables

| Variable | Default | Description |
|----------|---------|-------------|
| `PORT` | `8000` | Server port |
| `ML_API_KEY` | `dl-ml-dev-key-change-in-prod` | API authentication key |
| `ALLOWED_ORIGINS` | `http://localhost:5173,...` | CORS origins |
| `LOG_LEVEL` | `INFO` | Logging level |
| `ENVIRONMENT` | `development` | Environment name |
