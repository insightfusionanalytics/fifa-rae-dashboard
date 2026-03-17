/**
 * FIFA Player Analysis — Players API Route
 * GET /api/players
 * Paginated, searchable, sortable player list with filters.
 */

import { NextRequest, NextResponse } from "next/server";
import { getPlayers, type PlayerRow } from "@/lib/csv-loader";

const MAX_PAGE_SIZE = 100;
const DEFAULT_PAGE_SIZE = 50;

// Columns that can be sorted on
const SORTABLE_COLUMNS = new Set<keyof PlayerRow>([
  "short_name",
  "long_name",
  "age",
  "height_cm",
  "weight_kg",
  "overall",
  "potential",
  "league_name",
  "club_name",
  "nationality_name",
  "position_group",
  "primary_position",
  "rating_decile",
  "fifa_version",
  "birth_month",
  "birth_quarter",
  "football_year_quarter",
]);

function parseCommaSeparated(value: string | null): string[] {
  if (!value) return [];
  return value
    .split(",")
    .map((s) => s.trim())
    .filter((s) => s.length > 0);
}

function parseNumericCommaSeparated(value: string | null): number[] {
  if (!value) return [];
  return value
    .split(",")
    .map((s) => Number(s.trim()))
    .filter((n) => !Number.isNaN(n));
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = request.nextUrl;

    // Pagination
    const page = Math.max(1, Number(searchParams.get("page")) || 1);
    const pageSize = Math.min(
      MAX_PAGE_SIZE,
      Math.max(1, Number(searchParams.get("pageSize")) || DEFAULT_PAGE_SIZE)
    );

    // Search
    const search = (searchParams.get("search") ?? "").toLowerCase().trim();

    // Sort
    const sortParam = searchParams.get("sort") ?? "overall";
    const sortColumn = SORTABLE_COLUMNS.has(sortParam as keyof PlayerRow)
      ? (sortParam as keyof PlayerRow)
      : "overall";
    const order = searchParams.get("order") === "asc" ? "asc" : "desc";

    // Filters (comma-separated query params)
    const nationalityFilter = parseCommaSeparated(
      searchParams.get("nationality_name")
    );
    const positionGroupFilter = parseCommaSeparated(
      searchParams.get("position_group")
    );
    const leagueFilter = parseCommaSeparated(searchParams.get("league_name"));
    const ratingTierFilter = parseCommaSeparated(
      searchParams.get("rating_tier")
    );
    const fifaVersionFilter = parseNumericCommaSeparated(
      searchParams.get("fifa_version")
    );
    const footballYearTypeFilter = parseCommaSeparated(
      searchParams.get("football_year_type")
    );
    const isStarterParam = searchParams.get("is_starter");

    // Load and filter
    let rows = getPlayers();

    if (nationalityFilter.length > 0) {
      const set = new Set(nationalityFilter);
      rows = rows.filter((r) => set.has(r.nationality_name));
    }
    if (positionGroupFilter.length > 0) {
      const set = new Set(positionGroupFilter);
      rows = rows.filter((r) => set.has(r.position_group));
    }
    if (leagueFilter.length > 0) {
      const set = new Set(leagueFilter);
      rows = rows.filter((r) => set.has(r.league_name));
    }
    if (ratingTierFilter.length > 0) {
      const set = new Set(ratingTierFilter);
      rows = rows.filter((r) => set.has(r.rating_tier));
    }
    if (fifaVersionFilter.length > 0) {
      const set = new Set(fifaVersionFilter);
      rows = rows.filter((r) => set.has(r.fifa_version));
    }
    if (footballYearTypeFilter.length > 0) {
      const set = new Set(footballYearTypeFilter);
      rows = rows.filter((r) => set.has(r.football_year_type));
    }
    if (isStarterParam !== null) {
      const isStarter = isStarterParam === "true";
      rows = rows.filter((r) => r.is_starter === isStarter);
    }

    // Search (case-insensitive on short_name and long_name)
    if (search) {
      rows = rows.filter(
        (r) =>
          r.short_name.toLowerCase().includes(search) ||
          r.long_name.toLowerCase().includes(search)
      );
    }

    // Sort
    rows = [...rows].sort((a, b) => {
      const aVal = a[sortColumn];
      const bVal = b[sortColumn];

      if (typeof aVal === "string" && typeof bVal === "string") {
        const cmp = aVal.localeCompare(bVal);
        return order === "asc" ? cmp : -cmp;
      }

      if (typeof aVal === "number" && typeof bVal === "number") {
        return order === "asc" ? aVal - bVal : bVal - aVal;
      }

      return 0;
    });

    // Paginate
    const total = rows.length;
    const totalPages = Math.ceil(total / pageSize);
    const start = (page - 1) * pageSize;
    const paginatedRows = rows.slice(start, start + pageSize);

    return NextResponse.json({
      rows: paginatedRows,
      total,
      page,
      pageSize,
      totalPages,
    });
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Unknown error occurred";
    console.error("Players API error:", message);
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
