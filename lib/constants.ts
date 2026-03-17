export const QUARTER_COLORS = {
  Q1: "#2563EB",
  Q2: "#7C3AED",
  Q3: "#DC2626",
  Q4: "#D97706",
} as const;

export const COLORS = {
  primary: "#1E3A5F",
  accent: "#DC2626",
  neutral: "#6B7280",
  significant: "#2563EB",
  notSignificant: "#D1D5DB",
} as const;

export const QUARTER_LABELS = ["Q1 (Jan-Mar)", "Q2 (Apr-Jun)", "Q3 (Jul-Sep)", "Q4 (Oct-Dec)"];

export const FILTER_LABELS: Record<string, string> = {
  nationality_name: "Country",
  position_group: "Position",
  league_name: "League",
  rating_tier: "Rating",
  fifa_version: "FIFA Version",
  is_starter: "Players",
  football_year_type: "FY Type",
};
