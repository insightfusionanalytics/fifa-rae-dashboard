/**
 * FIFA Player Analysis — Aggregate API Route
 * POST /api/aggregate
 * Accepts filters, returns full RaeData for the filtered dataset.
 */

import { NextRequest, NextResponse } from "next/server";
import { getPlayers, type PlayerRow } from "@/lib/csv-loader";
import { computeAllAggregations } from "@/lib/aggregation";

interface AggregateFilters {
  nationality_name?: string[];
  position_group?: string[];
  league_name?: string[];
  rating_tier?: string[];
  fifa_version?: number[];
  is_starter?: boolean;
  football_year_type?: string[];
}

interface AggregateRequest {
  filters: AggregateFilters;
}

function applyFilters(
  rows: PlayerRow[],
  filters: AggregateFilters
): PlayerRow[] {
  let filtered = rows;

  if (filters.nationality_name && filters.nationality_name.length > 0) {
    const set = new Set(filters.nationality_name);
    filtered = filtered.filter((r) => set.has(r.nationality_name));
  }

  if (filters.position_group && filters.position_group.length > 0) {
    const set = new Set(filters.position_group);
    filtered = filtered.filter((r) => set.has(r.position_group));
  }

  if (filters.league_name && filters.league_name.length > 0) {
    const set = new Set(filters.league_name);
    filtered = filtered.filter((r) => set.has(r.league_name));
  }

  if (filters.rating_tier && filters.rating_tier.length > 0) {
    const set = new Set(filters.rating_tier);
    filtered = filtered.filter((r) => set.has(r.rating_tier));
  }

  if (filters.fifa_version && filters.fifa_version.length > 0) {
    const set = new Set(filters.fifa_version);
    filtered = filtered.filter((r) => set.has(r.fifa_version));
  }

  if (filters.is_starter !== undefined && filters.is_starter !== null) {
    filtered = filtered.filter((r) => r.is_starter === filters.is_starter);
  }

  if (filters.football_year_type && filters.football_year_type.length > 0) {
    const set = new Set(filters.football_year_type);
    filtered = filtered.filter((r) => set.has(r.football_year_type));
  }

  return filtered;
}

export async function POST(request: NextRequest) {
  try {
    const body = (await request.json()) as AggregateRequest;
    const filters = body.filters ?? {};

    const allRows = getPlayers();
    const filtered = applyFilters(allRows, filters);
    const data = computeAllAggregations(filtered);

    return NextResponse.json(data);
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Unknown error occurred";
    console.error("Aggregate API error:", message);
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
