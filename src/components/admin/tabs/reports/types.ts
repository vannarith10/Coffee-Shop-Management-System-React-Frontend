export interface ReportSummaryItem {
  value: number;
  growth_ptc: number;
}

export interface ReportSummary {
  gross_profit: ReportSummaryItem;
  net_revenue: ReportSummaryItem;
}

export interface SalesByCategory {
  label: string;
  percentage: number;
  revenue: number;
}

export interface ReportsResponse {
  summary: ReportSummary;
  revenue_trends: number[];
  sales_by_category: SalesByCategory[];
  busies_hours: number[][];
}
