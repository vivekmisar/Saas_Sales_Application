from pydantic import BaseModel, field_validator
from pathlib import Path
from app.config import settings


class AnalyzeRequest(BaseModel):
    """
    Request body for POST /analyze.

    We receive a file_path string from the Express server.
    The validator normalises it to an absolute Path object and
    ensures it points to an existing .csv file before any
    business logic runs — failing fast at the boundary.
    """

    file_path: str

    @field_validator("file_path")
    @classmethod
    def must_be_csv_and_exist(cls, v: str) -> str:
        path = Path(v)
        if not path.exists():
            raise ValueError(f"File not found: {v}")
        if path.suffix.lower() != ".csv":
            raise ValueError(f"Only .csv files are accepted, got: {path.suffix}")

        resolved = path.resolve()
        if settings.UPLOADS_BASE_DIR:
            base = Path(settings.UPLOADS_BASE_DIR).resolve()
            try:
                resolved.relative_to(base)
            except ValueError:
                raise ValueError(f"Access denied: file_path is outside allowed uploads directory '{base}'")

        return str(resolved)

