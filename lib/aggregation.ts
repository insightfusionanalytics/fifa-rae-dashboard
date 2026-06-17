/**
 * FIFA Player Analysis — Aggregation Functions
 * Port of the Python chi-squared / RAE analysis logic to TypeScript.
 * Produces identical numbers to 08_website_data.py for unfiltered data.
 */

import { jStat } from "jstat";
import type {
  Stats,
  QuarterData,
  MonthData,
  PositionGroup,
  DecileData,
  LeagueData,
  CountryData,
  TierData,
  Overview,
  RaeData,
} from "./types";
import type { PlayerRow } from "./csv-loader";

// ── Constants (match config.py exactly) ──────────────────────────────────

const POSITION_GROUP_ORDER = ["GK", "Defenders", "Midfielders", "Forwards"];

const TIER_1_LEAGUES = [
  "Premier League",
  "La Liga",
  "Ligue 1",
  "Serie A",
  "K League 1",
  "J-League",
  "Liga Portugal",
  "Bundesliga",
  "Eredivisie",
];

const SIGNIFICANCE_LEVEL = 0.05;

// ── Helpers ──────────────────────────────────────────────────────────────

/** Count occurrences of each value in an array. */
function countBy<T extends string | number>(arr: T[]): Map<T, number> {
  const map = new Map<T, number>();
  for (const v of arr) {
    map.set(v, (map.get(v) ?? 0) + 1);
  }
  return map;
}

/** Round to N decimal places (matches Python's round()). */
function round(value: number, decimals: number): number {
  const factor = Math.pow(10, decimals);
  return Math.round(value * factor) / factor;
}

// ── Chi-Squared Test ─────────────────────────────────────────────────────

/**
 * Chi-squared goodness-of-fit test against a uniform distribution.
 * Matches Python scipy.stats.chisquare exactly.
 */
export function chiSquaredTest(observed: number[]): Stats {
  const n = observed.reduce((a, b) => a + b, 0);
  const k = observed.length;

  if (n === 0 || k === 0) {
    return { chi2: 0, p: 1, v: 0, n: 0 };
  }

  const expected = n / k;
  let chi2 = 0;
  for (const obs of observed) {
    chi2 += Math.pow(obs - expected, 2) / expected;
  }

  const df = k - 1;
  const p = df > 0 ? 1 - jStat.chisquare.cdf(chi2, df) : 1;
  const v = Math.sqrt(chi2 / (n * (k - 1)));

  return {
    chi2: round(chi2, 2),
    p,
    v: round(v, 4),
    n,
  };
}

// ── Quarter Distribution ─────────────────────────────────────────────────

export function computeQuarters(rows: PlayerRow[]): QuarterData {
  const n = rows.length;
  if (n === 0) {
    return {
      labels: ["Q1", "Q2", "Q3", "Q4"],
      values: [0, 0, 0, 0],
      counts: [0, 0, 0, 0],
      stats: { chi2: 0, p: 1, v: 0, n: 0 },
    };
  }

  const qCounts = countBy(rows.map((r) => r.football_year_quarter));
  const counts = [1, 2, 3, 4].map((q) => qCounts.get(q) ?? 0);
  const values = counts.map((c) => round((c / n) * 100, 1));
  const stats = chiSquaredTest(counts);

  return {
    labels: ["Q1", "Q2", "Q3", "Q4"],
    values,
    counts,
    stats,
  };
}

// ── Month Distribution ───────────────────────────────────────────────────

export function computeMonths(rows: PlayerRow[]): MonthData {
  const n = rows.length;
  if (n === 0) {
    return {
      labels: Array.from({ length: 12 }, (_, i) => `M${i + 1}`),
      values: new Array(12).fill(0),
      stats: { chi2: 0, p: 1, v: 0, n: 0 },
    };
  }

  const mCounts = countBy(rows.map((r) => r.football_year_month));
  const counts = Array.from({ length: 12 }, (_, i) => mCounts.get(i + 1) ?? 0);
  const values = counts.map((c) => round((c / n) * 100, 1));
  const stats = chiSquaredTest(counts);

  return {
    labels: Array.from({ length: 12 }, (_, i) => `M${i + 1}`),
    values,
    stats,
  };
}

// ── Overview Stats ───────────────────────────────────────────────────────

export function computeOverview(rows: PlayerRow[]): Overview {
  if (rows.length === 0) {
    return {
      totalPlayers: 0,
      nationalities: 0,
      leagues: 0,
      fifaVersions: [],
      tier1Count: 0,
      starterCount: 0,
      avgAge: 0,
      avgHeight: 0,
      avgRating: 0,
    };
  }

  const nationalities = new Set(rows.map((r) => r.nationality_name));
  const leagues = new Set(
    rows.filter((r) => r.league_name).map((r) => r.league_name)
  );
  const fifaVersions = Array.from(
    new Set(rows.map((r) => r.fifa_version))
  ).sort((a, b) => a - b);

  const tier1Count = rows.filter((r) => r.is_tier_1).length;
  const starterCount = rows.filter((r) => r.is_starter).length;

  const sumAge = rows.reduce((s, r) => s + r.age, 0);
  const sumHeight = rows.reduce((s, r) => s + r.height_cm, 0);
  const sumRating = rows.reduce((s, r) => s + r.overall, 0);

  return {
    totalPlayers: rows.length,
    nationalities: nationalities.size,
    leagues: leagues.size,
    fifaVersions,
    tier1Count,
    starterCount,
    avgAge: round(sumAge / rows.length, 1),
    avgHeight: round(sumHeight / rows.length, 1),
    avgRating: round(sumRating / rows.length, 1),
  };
}

// ── By Position Group ────────────────────────────────────────────────────

export function computeByPosition(rows: PlayerRow[]): PositionGroup[] {
  return POSITION_GROUP_ORDER.map((group) => {
    const sub = rows.filter((r) => r.position_group === group);
    const n = sub.length;

    if (n === 0) {
      return {
        group,
        n: 0,
        quarters: [0, 0, 0, 0],
        stats: { chi2: 0, p: 1, v: 0, n: 0 },
      };
    }

    const qCounts = countBy(sub.map((r) => r.football_year_quarter));
    const counts = [1, 2, 3, 4].map((q) => qCounts.get(q) ?? 0);
    const quarters = counts.map((c) => round((c / n) * 100, 1));

    return {
      group,
      n,
      quarters,
      stats: chiSquaredTest(counts),
    };
  });
}

// ── By Rating Decile ─────────────────────────────────────────────────────

export function computeByDecile(rows: PlayerRow[]): DecileData[] {
  const deciles = Array.from(
    new Set(rows.map((r) => r.rating_decile))
  ).sort((a, b) => a - b);

  return deciles.map((dec) => {
    const sub = rows.filter((r) => r.rating_decile === dec);
    const q1Count = sub.filter((r) => r.football_year_quarter === 1).length;
    const q1Pct = sub.length > 0 ? round((q1Count / sub.length) * 100, 1) : 0;

    return {
      decile: dec,
      n: sub.length,
      q1Pct,
    };
  });
}

// ── By League (Tier 1 only) ──────────────────────────────────────────────

export function computeByLeague(rows: PlayerRow[]): LeagueData[] {
  const results: LeagueData[] = TIER_1_LEAGUES.map((league) => {
    const sub = rows.filter((r) => r.league_name === league);
    const n = sub.length;

    if (n === 0) {
      return {
        league,
        n: 0,
        quarters: [0, 0, 0, 0],
        stats: { chi2: 0, p: 1, v: 0, n: 0 },
      };
    }

    const qCounts = countBy(sub.map((r) => r.football_year_quarter));
    const counts = [1, 2, 3, 4].map((q) => qCounts.get(q) ?? 0);
    const quarters = counts.map((c) => round((c / n) * 100, 1));

    return {
      league,
      n,
      quarters,
      stats: chiSquaredTest(counts),
    };
  });

  // Sort by Cramer's V descending (matches Python)
  results.sort((a, b) => b.stats.v - a.stats.v);
  return results;
}

// ── By Country (Top 20) ─────────────────────────────────────────────────

export function computeByCountry(rows: PlayerRow[]): CountryData[] {
  // Find top 20 countries by count
  const countryCounts = countBy(rows.map((r) => r.nationality_name));
  const sortedCountries = Array.from(countryCounts.entries())
    .sort((a, b) => b[1] - a[1])
    .slice(0, 20)
    .map(([country]) => country);

  const results: CountryData[] = sortedCountries.map((country) => {
    const sub = rows.filter((r) => r.nationality_name === country);
    const n = sub.length;

    const qCounts = countBy(sub.map((r) => r.football_year_quarter));
    const counts = [1, 2, 3, 4].map((q) => qCounts.get(q) ?? 0);
    const q1Pct = n > 0 ? round((counts[0] / n) * 100, 1) : 0;
    const stats = chiSquaredTest(counts);

    // Get football year type from the first row of this country
    const fyType = sub.length > 0 ? sub[0].football_year_type : "jan";

    return {
      country,
      n,
      q1Pct,
      q1Excess: round(q1Pct - 25, 1),
      fyType,
      significant: stats.p < SIGNIFICANCE_LEVEL,
      stats,
    };
  });

  // Sort by Cramer's V descending (matches Python)
  results.sort((a, b) => b.stats.v - a.stats.v);
  return results;
}

// ── Tier 1 vs Other ──────────────────────────────────────────────────────

export function computeTierComparison(rows: PlayerRow[]): TierData[] {
  const tiers: Array<{ label: string; isTier1: boolean }> = [
    { label: "Tier 1", isTier1: true },
    { label: "Other", isTier1: false },
  ];

  return tiers.map(({ label, isTier1 }) => {
    const sub = rows.filter((r) => r.is_tier_1 === isTier1);
    const n = sub.length;

    if (n === 0) {
      return {
        tier: label,
        n: 0,
        quarters: [0, 0, 0, 0],
        stats: { chi2: 0, p: 1, v: 0, n: 0 },
      };
    }

    const qCounts = countBy(sub.map((r) => r.football_year_quarter));
    const counts = [1, 2, 3, 4].map((q) => qCounts.get(q) ?? 0);
    const quarters = counts.map((c) => round((c / n) * 100, 1));

    return {
      tier: label,
      n,
      quarters,
      stats: chiSquaredTest(counts),
    };
  });
}

// ── Master Aggregation ───────────────────────────────────────────────────

export function computeAllAggregations(rows: PlayerRow[]): RaeData {
  return {
    overview: computeOverview(rows),
    overallQuarters: computeQuarters(rows),
    overallMonths: computeMonths(rows),
    byPosition: computeByPosition(rows),
    byDecile: computeByDecile(rows),
    byLeague: computeByLeague(rows),
    byCountry: computeByCountry(rows),
    tierComparison: computeTierComparison(rows),
  };
}
