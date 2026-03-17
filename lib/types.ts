export interface Stats {
  chi2: number;
  p: number;
  v: number;
  n: number;
}

export interface Overview {
  totalPlayers: number;
  nationalities: number;
  leagues: number;
  fifaVersions: number[];
  tier1Count: number;
  starterCount: number;
  avgAge: number;
  avgHeight: number;
  avgRating: number;
}

export interface QuarterData {
  labels: string[];
  values: number[];
  counts: number[];
  stats: Stats;
}

export interface MonthData {
  labels: string[];
  values: number[];
  stats: Stats;
}

export interface PositionGroup {
  group: string;
  n: number;
  quarters: number[];
  stats: Stats;
}

export interface DecileData {
  decile: number;
  n: number;
  q1Pct: number;
}

export interface LeagueData {
  league: string;
  n: number;
  quarters: number[];
  stats: Stats;
}

export interface CountryData {
  country: string;
  n: number;
  q1Pct: number;
  q1Excess: number;
  fyType: string;
  significant: boolean;
  stats: Stats;
}

export interface TierData {
  tier: string;
  n: number;
  quarters: number[];
  stats: Stats;
}

export interface RaeData {
  overview: Overview;
  overallQuarters: QuarterData;
  overallMonths: MonthData;
  byPosition: PositionGroup[];
  byDecile: DecileData[];
  byLeague: LeagueData[];
  byCountry: CountryData[];
  tierComparison: TierData[];
}

export interface FilterState {
  nationality_name: string[];
  position_group: string[];
  league_name: string[];
  rating_tier: string[];
  fifa_version: number[];
  is_starter: boolean | null; // null = all
  football_year_type: string[];
}

export interface FilterOptions {
  nationality_name: string[];
  position_group: string[];
  league_name: string[];
  rating_tier: string[];
  fifa_version: number[];
  football_year_type: string[];
}

export interface DashboardMeta {
  filterOptions: FilterOptions;
  unfiltered: RaeData;
}

export interface PlayerTableRow {
  short_name: string;
  long_name: string;
  primary_position: string;
  position_group: string;
  nationality_name: string;
  league_name: string;
  club_name: string;
  overall: number;
  potential: number;
  age: number;
  birth_quarter: number;
  football_year_quarter: number;
  fifa_version: number;
  height_cm: number;
  preferred_foot: string;
}

export interface PaginatedResponse {
  rows: PlayerTableRow[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
}
