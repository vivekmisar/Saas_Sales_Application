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

    Design note: filter out rows with NaN revenue upfront so invalid or empty
    trailing CSV rows don't skew order counts or averages.
    """

    rev_col = col_map["revenue"]
    # Drop rows where revenue is missing/NaN
    df = df.dropna(subset=[rev_col]).copy()

    revenue_series: pd.Series = df[rev_col]

    # ── Core KPIs ──────────────────────────────────────────────────────────
    total_revenue = _r(revenue_series.sum()) if not revenue_series.empty else 0.0
    total_orders = len(df)

    # Unique customers — optional column, fallback to order count
    if "customer" in col_map:
        cust_col = col_map["customer"]
        total_customers = int(df[cust_col].dropna().nunique())
    else:
        total_customers = total_orders

    average_order_value = _r(total_revenue / total_orders) if total_orders else 0.0

    # Profit — optional; falls back to 0 if column not present
    if "profit" in col_map:
        profit_series = pd.to_numeric(df[col_map["profit"]], errors="coerce").dropna()
        total_profit = _r(profit_series.sum()) if not profit_series.empty else 0.0
    else:
        total_profit = 0.0

    # ── Monthly Revenue ─────────────────────────────────────────────────────
    monthly_revenue: list[MonthlyRevenue] = []
    if "date" in col_map:
        date_col = col_map["date"]
        df_date = df.dropna(subset=[date_col]).copy()
        df_date["_date"] = pd.to_datetime(df_date[date_col], errors="coerce")
        df_date = df_date.dropna(subset=["_date"])

        if not df_date.empty:
            df_date["_month"] = df_date["_date"].dt.to_period("M").astype(str)
            monthly = (
                df_date.groupby("_month", sort=True)[rev_col]
                .sum()
                .reset_index()
                .rename(columns={"_month": "month", rev_col: "revenue"})
            )
            monthly_revenue = [
                MonthlyRevenue(month=str(row["month"]), revenue=_r(row["revenue"]))
                for _, row in monthly.iterrows()
                if str(row["month"]) not in ("NaT", "nan", "NaN")
            ]

    # ── Top Products ────────────────────────────────────────────────────────
    top_products: list[ProductStat] = []
    if "product" in col_map:
        prod_col = col_map["product"]
        df_prod = df.dropna(subset=[prod_col]).copy()
        df_prod = df_prod[df_prod[prod_col].astype(str).str.strip() != ""]

        if not df_prod.empty:
            prod_group = df_prod.groupby(prod_col).agg(
                revenue=(rev_col, "sum"),
                orders=(rev_col, "count"),
            ).reset_index()

            prod_group = prod_group.sort_values("revenue", ascending=False).head(10)
            top_products = [
                ProductStat(
                    product=str(row[prod_col]).strip(),
                    revenue=_r(row["revenue"]),
                    orders=int(row["orders"]),
                )
                for _, row in prod_group.iterrows()
            ]

    # ── Category Revenue ────────────────────────────────────────────────────
    category_revenue: list[CategoryRevenue] = []
    if "category" in col_map:
        cat_col = col_map["category"]
        df_cat = df.dropna(subset=[cat_col]).copy()
        df_cat = df_cat[df_cat[cat_col].astype(str).str.strip() != ""]

        if not df_cat.empty:
            cat_group = (
                df_cat.groupby(cat_col)[rev_col]
                .sum()
                .reset_index()
                .sort_values(rev_col, ascending=False)
            )
            category_revenue = [
                CategoryRevenue(category=str(row[cat_col]).strip(), revenue=_r(row[rev_col]))
                for _, row in cat_group.iterrows()
            ]

    # ── Region Revenue ──────────────────────────────────────────────────────
    region_revenue: list[RegionRevenue] = []
    if "region" in col_map:
        reg_col = col_map["region"]
        df_reg = df.dropna(subset=[reg_col]).copy()
        df_reg = df_reg[df_reg[reg_col].astype(str).str.strip() != ""]

        if not df_reg.empty:
            reg_group = (
                df_reg.groupby(reg_col)[rev_col]
                .sum()
                .reset_index()
                .sort_values(rev_col, ascending=False)
            )
            region_revenue = [
                RegionRevenue(region=str(row[reg_col]).strip(), revenue=_r(row[rev_col]))
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

