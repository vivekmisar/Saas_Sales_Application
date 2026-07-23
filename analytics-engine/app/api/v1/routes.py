from fastapi import APIRouter
from app.schemas.request import AnalyzeRequest
from app.schemas.response import AnalyticsResult
from app.services.csv_reader import load_and_validate
from app.services.analytics import compute

router = APIRouter()


@router.post(
    "/analyze",
    response_model=AnalyticsResult,
    summary="Analyze a CSV file",
    description=(
        "Reads the CSV at the given path, detects column roles via synonym mapping, "
        "and returns a structured JSON payload containing all KPIs. "
        "No graphs, no HTML — pure JSON."
    ),
)
async def analyze(body: AnalyzeRequest) -> AnalyticsResult:
    """
    POST /analyze

    Orchestrates the two-step pipeline:
      1. csv_reader.load_and_validate — I/O + schema detection
      2. analytics.compute            — pure KPI computation

    Keeping these as separate services means each can be tested and
    replaced independently. The route handler owns zero business logic.
    """
    df, col_map = load_and_validate(body.file_path)
    return compute(df, col_map)
