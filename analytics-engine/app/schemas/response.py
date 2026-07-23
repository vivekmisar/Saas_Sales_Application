from pydantic import BaseModel
from typing import List


class MonthlyRevenue(BaseModel):
    month: str        # "2024-01"
    revenue: float


class ProductStat(BaseModel):
    product: str
    revenue: float
    orders: int


class CategoryRevenue(BaseModel):
    category: str
    revenue: float


class RegionRevenue(BaseModel):
    region: str
    revenue: float


class AnalyticsResult(BaseModel):
    """
    The complete analytics payload returned by POST /analyze.

    All monetary values are floats rounded to 2 decimal places.
    Lists are sorted descending by revenue unless noted otherwise.
    """

    total_revenue: float
    total_orders: int
    total_customers: int
    average_order_value: float
    total_profit: float

    monthly_revenue: List[MonthlyRevenue]
    top_products: List[ProductStat]
    category_revenue: List[CategoryRevenue]
    region_revenue: List[RegionRevenue]
