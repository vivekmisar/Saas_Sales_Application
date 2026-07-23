import pandas as pd
from pathlib import Path
from fastapi import HTTPException


# ── Column synonym maps ──────────────────────────────────────────────────────
# Real-world CSVs use inconsistent naming. Instead of rejecting them, we
# detect the most likely column for each semantic role.
# Keys = semantic role, Values = list of acceptable header names (lowercase).

COLUMN_SYNONYMS: dict[str, list[str]] = {
    "revenue": [
        "total_revenue", "revenue", "amount", "sales", "total_sales",
        "sale_amount", "gross_revenue", "net_revenue",
    ],
    "date": [
        "date", "order_date", "sale_date", "transaction_date", "created_at",
    ],
    "product": [
        "product", "product_name", "item", "item_name", "sku", "description",
    ],
    "category": [
        "category", "product_category", "type", "product_type", "segment",
        "customer_type", "customer_segment",
    ],
    "region": [
        "region", "territory", "area", "location", "market", "country",
    ],
    "customer": [
        "customer_id", "customer", "client_id", "client", "account_id",
        "customer_type",
    ],
    "quantity": [
        "quantity", "qty", "units", "count", "volume",
    ],
    "profit": [
        "profit", "net_profit", "gross_profit", "margin",
    ],
}


def _find_column(df: pd.DataFrame, role: str) -> str | None:
    """
    Return the first DataFrame column that matches a known synonym for `role`.
    Comparison is case-insensitive and ignores leading/trailing whitespace.
    Returns None if no match is found (caller decides whether to raise).
    """
    normalised = {col.strip().lower(): col for col in df.columns}
    for synonym in COLUMN_SYNONYMS.get(role, []):
        if synonym in normalised:
            return normalised[synonym]
    return None


def load_and_validate(file_path: str) -> tuple[pd.DataFrame, dict[str, str]]:
    """
    Read a CSV from disk and resolve its columns to semantic roles.

    Returns:
        df      — cleaned DataFrame
        col_map — dict mapping role → actual column name, e.g. {"revenue": "Total_Revenue"}

    Raises:
        HTTPException 422 — if the file can't be read or lacks a revenue column
                            (the minimum required for any useful analytics).
    """
    path = Path(file_path)

    try:
        df = pd.read_csv(path)
    except Exception as exc:
        raise HTTPException(
            status_code=422,
            detail=f"Could not read CSV file: {exc}",
        )

    if df.empty:
        raise HTTPException(status_code=422, detail="CSV file contains no data rows.")

    # Strip whitespace from column names to handle sloppy exports
    df.columns = df.columns.str.strip()

    # Build the column map — revenue is the only hard requirement
    col_map: dict[str, str] = {}
    for role in COLUMN_SYNONYMS:
        matched = _find_column(df, role)
        if matched:
            col_map[role] = matched

    if "revenue" not in col_map:
        raise HTTPException(
            status_code=422,
            detail=(
                "CSV must contain a revenue column. "
                f"Accepted names: {COLUMN_SYNONYMS['revenue']}. "
                f"Found: {list(df.columns)}"
            ),
        )

    # Coerce the revenue column to numeric, replacing unparseable values with NaN
    df[col_map["revenue"]] = pd.to_numeric(df[col_map["revenue"]], errors="coerce")

    return df, col_map
