/**
 * FIFA Player Analysis — CSV Loader
 * Singleton that reads the clean CSV once and caches it in a module-level variable.
 * Server-side only (uses fs and path).
 */

import fs from "fs";
import path from "path";
import Papa from "papaparse";

export interface PlayerRow {
  player_id: number;
  fifa_version: number;
  short_name: string;
  long_name: string;
  player_positions: string;
  age: number;
  dob: string;
  height_cm: number;
  weight_kg: number;
  league_name: string;
  club_name: string;
  club_position: string;
  nationality_name: string;
  preferred_foot: string;
  overall: number;
  potential: number;
  birth_month: number;
  birth_quarter: number;
  birth_year: number;
  football_year_type: string;
  football_year_month: number;
  football_year_quarter: number;
  primary_position: string;
  position_group: string;
  is_tier_1: boolean;
  league_tier: string;
  rating_tier: string;
  is_starter: boolean;
  rating_decile: number;
}

// Columns that must be parsed as numbers
const NUMERIC_COLUMNS = new Set([
  "player_id",
  "fifa_version",
  "age",
  "height_cm",
  "weight_kg",
  "overall",
  "potential",
  "birth_month",
  "birth_quarter",
  "birth_year",
  "football_year_month",
  "football_year_quarter",
  "rating_decile",
]);

// Columns that must be parsed as booleans (stored as "True"/"False" in CSV)
const BOOLEAN_COLUMNS = new Set(["is_tier_1", "is_starter"]);

let cachedPlayers: PlayerRow[] | null = null;

/**
 * Load all players from the clean CSV. Caches the result after first call.
 * Must be called server-side only.
 */
export function getPlayers(): PlayerRow[] {
  if (cachedPlayers !== null) {
    return cachedPlayers;
  }

  // Production (Vercel): CSV bundled inside website/data/
  // Development: fall back to project-level data folder
  let csvPath = path.join(process.cwd(), "data", "fifa_players_clean.csv");
  if (!fs.existsSync(csvPath)) {
    csvPath = path.join(
      process.cwd(),
      "..",
      "data",
      "processed",
      "fifa_players_clean.csv"
    );
  }

  if (!fs.existsSync(csvPath)) {
    throw new Error(`CSV file not found. Checked website/data/ and ../data/processed/`);
  }

  const csvContent = fs.readFileSync(csvPath, "utf-8");

  const result = Papa.parse<Record<string, string>>(csvContent, {
    header: true,
    skipEmptyLines: true,
  });

  if (result.errors.length > 0) {
    const criticalErrors = result.errors.filter(
      (e) => e.type !== "FieldMismatch"
    );
    if (criticalErrors.length > 0) {
      throw new Error(
        `CSV parse errors: ${criticalErrors.map((e) => e.message).join("; ")}`
      );
    }
  }

  cachedPlayers = result.data.map((raw) => {
    const row: Record<string, unknown> = {};

    for (const [key, value] of Object.entries(raw)) {
      if (BOOLEAN_COLUMNS.has(key)) {
        row[key] = value === "True";
      } else if (NUMERIC_COLUMNS.has(key)) {
        const parsed = Number(value);
        row[key] = Number.isNaN(parsed) ? 0 : parsed;
      } else {
        row[key] = value ?? "";
      }
    }

    return row as unknown as PlayerRow;
  });

  return cachedPlayers;
}
