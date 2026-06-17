/**
 * FIFA Player Analysis — Profile Aggregate API Route
 * POST /api/profile
 * Accepts filters, returns player profile analysis for the filtered dataset.
 */

import { NextRequest, NextResponse } from "next/server";
import { getPlayers, type PlayerRow } from "@/lib/csv-loader";

const LEFT_HAND_PCT = 10.6;
const BIG_5 = new Set(["Premier League", "La Liga", "Serie A", "Bundesliga", "Ligue 1"]);
const MONTH_NAMES: Record<number, string> = {
  1: "January", 2: "February", 3: "March", 4: "April",
  5: "May", 6: "June", 7: "July", 8: "August",
  9: "September", 10: "October", 11: "November", 12: "December",
};

const SUB_POSITION_MAP: Record<string, string> = {
  GK: "Goalkeeper", CB: "Centre Back",
  LB: "Fullback", RB: "Fullback", LWB: "Fullback", RWB: "Fullback",
  CDM: "Central Midfielder", CM: "Central Midfielder", CAM: "Central Midfielder",
  LM: "Winger", RM: "Winger", LW: "Winger", RW: "Winger",
  ST: "Forward/Striker", CF: "Forward/Striker",
};

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

function medianVal(arr: number[]): number {
  if (!arr.length) return 0;
  const sorted = [...arr].sort((a, b) => a - b);
  const mid = Math.floor(sorted.length / 2);
  return sorted.length % 2 ? sorted[mid] : Math.round(((sorted[mid - 1] + sorted[mid]) / 2) * 10) / 10;
}

function topN<T>(arr: T[], key: (item: T) => string, n: number): Array<{ value: string; count: number; pct: number }> {
  const counts: Record<string, number> = {};
  arr.forEach((item) => { const k = key(item); counts[k] = (counts[k] || 0) + 1; });
  return Object.entries(counts)
    .sort((a, b) => b[1] - a[1])
    .slice(0, n)
    .map(([value, count]) => ({ value, count, pct: Math.round((count / arr.length) * 1000) / 10 }));
}

function computeProfile(rows: PlayerRow[]) {
  const withPos = rows.map((r) => ({
    ...r,
    sub_position: SUB_POSITION_MAP[r.primary_position] ?? "Unknown",
  }));

  // Modal player
  const countries = topN(withPos, (r) => r.nationality_name, 1);
  const feet = topN(withPos, (r) => r.preferred_foot, 1);
  const months = topN(withPos, (r) => String(r.birth_month), 1);
  const positions = topN(withPos, (r) => r.sub_position, 1);
  const primaryPos = topN(withPos, (r) => r.primary_position, 1);
  const leagues = topN(withPos, (r) => r.league_name, 1);

  const modalPlayer = {
    country: { ...countries[0] },
    foot: { ...feet[0] },
    birth_month: { ...months[0], value: MONTH_NAMES[Number(months[0]?.value)] || months[0]?.value, month_num: Number(months[0]?.value) },
    position: { ...positions[0] },
    primary_position: { ...primaryPos[0] },
    league: { ...leagues[0] },
    avg_height: avg(rows.map((r) => r.height_cm)),
    avg_weight: avg(rows.map((r) => r.weight_kg)),
    avg_overall: avg(rows.map((r) => r.overall)),
    total_players: rows.length,
  };

  // Foot analysis
  const leftCount = rows.filter((r) => r.preferred_foot === "Left").length;
  const rightCount = rows.filter((r) => r.preferred_foot === "Right").length;
  const total = leftCount + rightCount;
  const leftPct = Math.round((leftCount / total) * 1000) / 10;

  const posFoot: Record<string, { left: number; right: number }> = {};
  withPos.forEach((r) => {
    const pos = r.sub_position;
    if (!posFoot[pos]) posFoot[pos] = { left: 0, right: 0 };
    if (r.preferred_foot === "Left") posFoot[pos].left++;
    else posFoot[pos].right++;
  });

  const byPosition: Record<string, { left_pct: number; right_pct: number; left_count: number; right_count: number }> = {};
  for (const [pos, counts] of Object.entries(posFoot)) {
    const t = counts.left + counts.right;
    byPosition[pos] = {
      left_pct: Math.round((counts.left / t) * 1000) / 10,
      right_pct: Math.round((counts.right / t) * 1000) / 10,
      left_count: counts.left,
      right_count: counts.right,
    };
  }

  const countryFoot: Record<string, { left: number; total: number }> = {};
  const countryCounts: Record<string, number> = {};
  rows.forEach((r) => {
    countryCounts[r.nationality_name] = (countryCounts[r.nationality_name] || 0) + 1;
    if (!countryFoot[r.nationality_name]) countryFoot[r.nationality_name] = { left: 0, total: 0 };
    countryFoot[r.nationality_name].total++;
    if (r.preferred_foot === "Left") countryFoot[r.nationality_name].left++;
  });
  const top20Countries = Object.entries(countryCounts).sort((a, b) => b[1] - a[1]).slice(0, 20).map(([c]) => c);
  const byCountry: Record<string, { left_pct: number; total: number }> = {};
  top20Countries.forEach((c) => {
    byCountry[c] = { left_pct: Math.round((countryFoot[c].left / countryFoot[c].total) * 1000) / 10, total: countryFoot[c].total };
  });

  const footAnalysis = {
    overall: { left_foot_pct: leftPct, right_foot_pct: Math.round((rightCount / total) * 1000) / 10, left_foot_count: leftCount, right_foot_count: rightCount },
    population_baseline: { left_hand_pct: LEFT_HAND_PCT, right_hand_pct: Math.round((100 - LEFT_HAND_PCT) * 10) / 10 },
    ratio: Math.round((leftPct / LEFT_HAND_PCT) * 100) / 100,
    byPosition,
    byCountry,
  };

  // Country representation
  const countryTop: Record<string, number> = {};
  rows.filter((r) => r.overall >= 80).forEach((r) => { countryTop[r.nationality_name] = (countryTop[r.nationality_name] || 0) + 1; });
  const countryRepresentation = Object.entries(countryCounts)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 30)
    .map(([country, total]) => ({
      country,
      total_players: total,
      top_players: countryTop[country] || 0,
      top_pct: Math.round(((countryTop[country] || 0) / total) * 1000) / 10,
    }))
    .sort((a, b) => b.top_pct - a.top_pct);

  // Median stats
  const allMonths = rows.map((r) => r.birth_month);
  const allHeights = rows.map((r) => r.height_cm);
  const big5Rows = rows.filter((r) => BIG_5.has(r.league_name));
  const restRows = rows.filter((r) => !BIG_5.has(r.league_name));

  // Rating tier breakdown for median stats
  const sorted = [...rows].sort((a, b) => b.overall - a.overall);
  const top20Cutoff = Math.floor(sorted.length * 0.2);
  const bottom20Cutoff = Math.floor(sorted.length * 0.8);
  const topTier = sorted.slice(0, top20Cutoff);
  const middleTier = sorted.slice(top20Cutoff, bottom20Cutoff);
  const bottomTier = sorted.slice(bottom20Cutoff);

  function ratingTierStats(subset: PlayerRow[]) {
    if (!subset.length) return null;
    const m = medianVal(subset.map((r) => r.birth_month));
    return {
      median_birth_month: m,
      median_birth_month_name: MONTH_NAMES[Math.round(m)] || "",
      median_height: medianVal(subset.map((r) => r.height_cm)),
      count: subset.length,
    };
  }

  const medianStats = {
    overall: {
      median_birth_month: medianVal(allMonths),
      median_birth_month_name: MONTH_NAMES[Math.round(medianVal(allMonths))] || "",
      median_height: medianVal(allHeights),
    },
    byRating: {
      "Top 20%": ratingTierStats(topTier),
      "Middle": ratingTierStats(middleTier),
      "Bottom 20%": ratingTierStats(bottomTier),
    },
    big5: big5Rows.length ? {
      median_birth_month: medianVal(big5Rows.map((r) => r.birth_month)),
      median_height: medianVal(big5Rows.map((r) => r.height_cm)),
      count: big5Rows.length,
    } : null,
    rest: restRows.length ? {
      median_birth_month: medianVal(restRows.map((r) => r.birth_month)),
      median_height: medianVal(restRows.map((r) => r.height_cm)),
      count: restRows.length,
    } : null,
  };

  // Splits
  function profileSummary(subset: typeof withPos) {
    if (!subset.length) return null;
    const cTop = topN(subset, (r) => r.nationality_name, 3);
    const pTop = topN(subset, (r) => r.sub_position, 3);
    return {
      count: subset.length,
      avg_overall: avg(subset.map((r) => r.overall)),
      avg_height: avg(subset.map((r) => r.height_cm)),
      left_foot_pct: Math.round((subset.filter((r) => r.preferred_foot === "Left").length / subset.length) * 1000) / 10,
      top_3_countries: cTop,
      top_3_positions: pTop,
      median_birth_month: medianVal(subset.map((r) => r.birth_month)),
    };
  }

  const topRated = withPos.filter((r) => r.overall >= 80);
  const bottomRated = withPos.filter((r) => r.overall < 65);
  const big5P = withPos.filter((r) => BIG_5.has(r.league_name));
  const restP = withPos.filter((r) => !BIG_5.has(r.league_name));

  const splits = {
    byRating: { top: profileSummary(topRated), bottom: profileSummary(bottomRated), top_threshold: 80, bottom_threshold: 65 },
    byLeague: { big5: profileSummary(big5P), rest: profileSummary(restP) },
  };

  return {
    totalPlayers: rows.length,
    modalPlayer,
    footAnalysis,
    countryRepresentation,
    medianStats,
    splits,
    big5Leagues: Array.from(BIG_5).sort(),
    leftHandPopulationPct: LEFT_HAND_PCT,
  };
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const filters = body.filters ?? {};
    const allRows = getPlayers();
    const filtered = applyFilters(allRows, filters);
    const data = computeProfile(filtered);
    return NextResponse.json(data);
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unknown error";
    console.error("Profile API error:", message);
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
