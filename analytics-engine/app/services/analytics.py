import pandas as pd
import numpy as np
from app.schemas.response import (
    AnalyticsResult,
    MonthlyRevenue,
    ProductStat,
    CategoryRevenue,
    RegionRevenue,
)


def _r(value: float) -> float:
    """Round to 2 decimal places, converting numpy types to plain Python float."""
    return round(float(value), 2)


def compute(df: pd.DataFrame, col_map: dict[str, str]) -> AnalyticsResult:
    """
    Pure computation layer — no I/O, no HTTP concerns.

    Each KPI is computed only from columns that were actually detected
    in the CSV (via col_map). Missing optional columns (category, region,
    profit, etc.) gracefully degrade to empty lists or zero values.

    Design note: every aggregation drops NaN before summing so a single
    malformed row doesn't corrupt the entire dataset.
    """

    rev_col = col_map["revenue"]
    revenue_series: pd.Series = df[rev_col].dropna()

    # ── Core KPIs ──────────────────────────────────────────────────────────
    total_revenue = _r(revenue_series.sum())
    total_orders = len(df)

    # Unique customers — optional column, fallback to order count
    if "customer" in col_map:
        total_customers = int(df[col_map["customer"]].nunique())
    else:
        total_customers = total_orders

    average_order_value = _r(total_revenue / total_orders) if total_orders else 0.0

    # Profit — optional; falls back to 0 if column not present
    if "profit" in col_map:
        profit_series = pd.to_numeric(df[col_map["profit"]], errors="coerce").dropna()
        total_profit = _r(profit_series.sum())
    else:
        total_profit = 0.0

    # ── Monthly Revenue ─────────────────────────────────────────────────────
    monthly_revenue: list[MonthlyRevenue] = []
    if "date" in col_map:
        date_col = col_map["date"]
        df["_date"] = pd.to_datetime(df[date_col], errors="coerce")
        df["_month"] = df["_date"].dt.to_period("M").astype(str)

        monthly = (
            df.groupby("_month", sort=True)[rev_col]
            .sum()
            .reset_index()
            .rename(columns={"_month": "month", rev_col: "revenue"})
        )
        monthly_revenue = [
            MonthlyRevenue(month=row["month"], revenue=_r(row["revenue"]))
            for _, row in monthly.iterrows()
        ]

    # ── Top Products ────────────────────────────────────────────────────────
    top_products: list[ProductStat] = []
    if "product" in col_map:
        prod_col = col_map["product"]
        prod_group = df.groupby(prod_col).agg(
            revenue=(rev_col, "sum"),
            orders=(rev_col, "count"),
        ).reset_index()

        prod_group = prod_group.sort_values("revenue", ascending=False).head(10)
        top_products = [
            ProductStat(
                product=str(row[prod_col]),
                revenue=_r(row["revenue"]),
                orders=int(row["orders"]),
            )
            for _, row in prod_group.iterrows()
        ]

    # ── Category Revenue ────────────────────────────────────────────────────
    category_revenue: list[CategoryRevenue] = []
    if "category" in col_map:
        cat_col = col_map["category"]
        cat_group = (
            df.groupby(cat_col)[rev_col]
            .sum()
            .reset_index()
            .sort_values(rev_col, ascending=False)
        )
        category_revenue = [
            CategoryRevenue(category=str(row[cat_col]), revenue=_r(row[rev_col]))
            for _, row in cat_group.iterrows()
        ]

    # ── Region Revenue ──────────────────────────────────────────────────────
    region_revenue: list[RegionRevenue] = []
    if "region" in col_map:
        reg_col = col_map["region"]
        reg_group = (
            df.groupby(reg_col)[rev_col]
            .sum()
            .reset_index()
            .sort_values(rev_col, ascending=False)
        )
        region_revenue = [
            RegionRevenue(region=str(row[reg_col]), revenue=_r(row[rev_col]))
            for _, row in reg_group.iterrows()
        ]

    return AnalyticsResult(
        total_revenue=total_revenue,
        total_orders=total_orders,
        total_customers=total_customers,
        average_order_value=average_order_value,
        total_profit=total_profit,
        monthly_revenue=monthly_revenue,
        top_products=top_products,
        category_revenue=category_revenue,
        region_revenue=region_revenue,
    )
