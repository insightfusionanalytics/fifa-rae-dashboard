/**
 * FIFA Player Analysis — Height Aggregate API Route
 * POST /api/height
 * Accepts filters, returns height analysis for the filtered dataset.
 */

import { NextRequest, NextResponse } from "next/server";
import { getPlayers, type PlayerRow } from "@/lib/csv-loader";

const SUB_POSITION_MAP: Record<string, string> = {
  GK: "Goalkeeper",
  CB: "Centre Back",
  LB: "Fullback", RB: "Fullback", LWB: "Fullback", RWB: "Fullback",
  CDM: "Central Midfielder", CM: "Central Midfielder", CAM: "Central Midfielder",
  LM: "Winger", RM: "Winger", LW: "Winger", RW: "Winger",
  ST: "Forward/Striker", CF: "Forward/Striker",
};

const SUB_POSITION_ORDER = [
  "Goalkeeper", "Centre Back", "Fullback", "Central Midfielder", "Winger", "Forward/Striker",
];

const BIG_5 = new Set(["Premier League", "La Liga", "Serie A", "Bundesliga", "Ligue 1"]);
const TARYN_POSITIONS = ["Winger", "Central Midfielder", "Centre Back"];

interface Filters {
  nationality_name?: string[];
  position_group?: string[];
  league_name?: string[];
  rating_tier?: string[];
  fifa_version?: number[];
  is_starter?: boolean;
  football_year_type?: string[];
}

function applyFilters(rows: PlayerRow[], filters: Filters): PlayerRow[] {
  let filtered = rows;
  if (filters.nationality_name?.length) {
    const s = new Set(filters.nationality_name);
    filtered = filtered.filter((r) => s.has(r.nationality_name));
  }
  if (filters.position_group?.length) {
    const s = new Set(filters.position_group);
    filtered = filtered.filter((r) => s.has(r.position_group));
  }
  if (filters.league_name?.length) {
    const s = new Set(filters.league_name);
    filtered = filtered.filter((r) => s.has(r.league_name));
  }
  if (filters.rating_tier?.length) {
    const s = new Set(filters.rating_tier);
    filtered = filtered.filter((r) => s.has(r.rating_tier));
  }
  if (filters.fifa_version?.length) {
    const s = new Set(filters.fifa_version);
    filtered = filtered.filter((r) => s.has(r.fifa_version));
  }
  if (filters.is_starter !== undefined && filters.is_starter !== null) {
    filtered = filtered.filter((r) => r.is_starter === filters.is_starter);
  }
  if (filters.football_year_type?.length) {
    const s = new Set(filters.football_year_type);
    filtered = filtered.filter((r) => s.has(r.football_year_type));
  }
  return filtered;
}

function avg(arr: number[]): number {
  return arr.length ? Math.round((arr.reduce((a, b) => a + b, 0) / arr.length) * 10) / 10 : 0;
}

function median(arr: number[]): number {
  if (!arr.length) return 0;
  const sorted = [...arr].sort((a, b) => a - b);
  const mid = Math.floor(sorted.length / 2);
  return sorted.length % 2 ? sorted[mid] : (sorted[mid - 1] + sorted[mid]) / 2;
}

function computeHeight(rows: PlayerRow[]) {
  // Add sub_position
  const withPos = rows.map((r) => ({
    ...r,
    sub_position: SUB_POSITION_MAP[r.primary_position] ?? "Unknown",
  }));

  // By sub-position
  const bySubPosition = SUB_POSITION_ORDER.map((pos) => {
    const heights = withPos.filter((r) => r.sub_position === pos).map((r) => r.height_cm);
    return {
      position: pos,
      avg_height: avg(heights),
      median_height: Math.round(median(heights) * 10) / 10,
      count: heights.length,
      min: heights.length ? Math.min(...heights) : 0,
      max: heights.length ? Math.max(...heights) : 0,
    };
  }).filter((d) => d.count > 0);

  // Top vs all
  const topVsAll = SUB_POSITION_ORDER.map((pos) => {
    const allH = withPos.filter((r) => r.sub_position === pos).map((r) => r.height_cm);
    const topH = withPos.filter((r) => r.sub_position === pos && r.overall >= 80).map((r) => r.height_cm);
    return {
      position: pos,
      all_avg: avg(allH),
      all_count: allH.length,
      top_avg: topH.length ? avg(topH) : null,
      top_count: topH.length,
      diff: topH.length ? Math.round((avg(topH) - avg(allH)) * 10) / 10 : null,
    };
  }).filter((d) => d.all_count > 0);

  // Top countries
  const countryCounts: Record<string, number> = {};
  withPos.forEach((r) => { countryCounts[r.nationality_name] = (countryCounts[r.nationality_name] || 0) + 1; });
  const topCountryNames = Object.entries(countryCounts).sort((a, b) => b[1] - a[1]).slice(0, 5).map(([c]) => c);

  const topCountries = topCountryNames.map((country) => {
    const cRows = withPos.filter((r) => r.nationality_name === country);
    const entry: Record<string, unknown> = {
      country,
      total_players: cRows.length,
      country_avg_height: avg(cRows.map((r) => r.height_cm)),
    };
    for (const posName of TARYN_POSITIONS) {
      const pRows = cRows.filter((r) => r.sub_position === posName);
      const key = posName.toLowerCase().replace(/ /g, "_").replace(/\//g, "_");
      entry[key] = pRows.length ? { avg_height: avg(pRows.map((r) => r.height_cm)), count: pRows.length } : { avg_height: null, count: 0 };
    }
    return entry;
  });

  // By rating decile
  const decileGroups: Record<number, number[]> = {};
  withPos.forEach((r) => {
    (decileGroups[r.rating_decile] ??= []).push(r.height_cm);
  });
  const byRatingDecile = Object.entries(decileGroups)
    .sort(([a], [b]) => Number(a) - Number(b))
    .map(([d, heights]) => ({ decile: Number(d), avg_height: avg(heights), count: heights.length }));

  // By league tier
  const big5Heights = withPos.filter((r) => BIG_5.has(r.league_name)).map((r) => r.height_cm);
  const restHeights = withPos.filter((r) => !BIG_5.has(r.league_name)).map((r) => r.height_cm);

  return {
    totalPlayers: rows.length,
    bySubPosition,
    topVsAll,
    topCountries,
    byRatingDecile,
    byLeagueTier: {
      big_5: big5Heights.length ? { avg_height: avg(big5Heights), count: big5Heights.length } : null,
      rest: restHeights.length ? { avg_height: avg(restHeights), count: restHeights.length } : null,
    },
    overallAvgHeight: avg(rows.map((r) => r.height_cm)),
    overallMedianHeight: Math.round(median(rows.map((r) => r.height_cm)) * 10) / 10,
    subPositionOrder: SUB_POSITION_ORDER,
    big5Leagues: Array.from(BIG_5).sort(),
  };
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const filters = body.filters ?? {};
    const allRows = getPlayers();
    const filtered = applyFilters(allRows, filters);
    const data = computeHeight(filtered);
    return NextResponse.json(data);
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unknown error";
    console.error("Height API error:", message);
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
