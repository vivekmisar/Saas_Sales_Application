# analytics-engine

A standalone FastAPI microservice that reads CSV files uploaded by the Express server and returns structured sales analytics as JSON.

## Stack
- **FastAPI** — HTTP framework
- **Pandas** — CSV parsing and aggregation
- **NumPy** — numerical operations
- **Pydantic v2** — request/response validation and serialisation

## Folder Structure
```
analytics-engine/
├── app/
│   ├── main.py           # App factory + CORS + routing
│   ├── config.py         # Pydantic Settings (env-driven config)
│   ├── api/v1/
│   │   └── routes.py     # POST /analyze endpoint
│   ├── schemas/
│   │   ├── request.py    # AnalyzeRequest
│   │   └── response.py   # AnalyticsResult
│   └── services/
│       ├── csv_reader.py # CSV I/O + flexible column detection
│       └── analytics.py  # Pure KPI computation
├── requirements.txt
└── .env.example
```

## Setup

```bash
cd analytics-engine

# Create and activate virtualenv
python -m venv venv
venv\Scripts\activate        # Windows
# source venv/bin/activate   # macOS / Linux

# Install dependencies
pip install -r requirements.txt

# Configure environment
copy .env.example .env
# Edit .env — set UPLOADS_BASE_DIR to the Express server's uploads folder

# Start the server
uvicorn app.main:app --host 0.0.0.0 --port 8000 --reload
```

## API

### `POST /api/v1/analyze`

**Request body:**
```json
{ "file_path": "/absolute/path/to/uploaded.csv" }
```

**Response:**
```json
{
  "total_revenue": 45000.0,
  "total_orders": 120,
  "total_customers": 85,
  "average_order_value": 375.0,
  "total_profit": 12000.0,
  "monthly_revenue": [{ "month": "2024-01", "revenue": 15000.0 }],
  "top_products": [{ "product": "CRM Pro", "revenue": 20000.0, "orders": 40 }],
  "category_revenue": [{ "category": "Enterprise", "revenue": 30000.0 }],
  "region_revenue": [{ "region": "North America", "revenue": 25000.0 }]
}
```

### `GET /health`
Returns service status.

## Column Detection
The engine uses **flexible column detection** — it accepts common synonyms for each semantic role instead of requiring exact column names. Minimum requirement: a revenue-like column (e.g. `Revenue`, `Total_Revenue`, `Amount`, `Sales`).
