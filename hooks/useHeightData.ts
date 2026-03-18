"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import type { FilterState, FilterOptions } from "@/lib/types";

/* ─── Height API response shape (matches /api/height POST response) ─── */

export interface HeightData {
  totalPlayers: number;
  bySubPosition: Array<{
    position: string;
    avg_height: number;
    median_height: number;
    std_dev: number;
    count: number;
    min: number;
    max: number;
  }>;
  topVsAll: Array<{
    position: string;
    all_avg: number;
    all_count: number;
    top_avg: number;
    top_count: number;
    diff: number;
  }>;
  topCountries: Array<{
    country: string;
    total_players: number;
    country_avg_height: number;
    winger: { avg_height: number; count: number };
    central_midfielder: { avg_height: number; count: number };
    centre_back: { avg_height: number; count: number };
  }>;
  byRatingDecile: Array<{
    decile: number;
    avg_height: number;
    count: number;
  }>;
  byLeagueTier: {
    big_5: { avg_height: number; count: number };
    rest: { avg_height: number; count: number };
  };
  overallAvgHeight: number;
  overallMedianHeight: number;
  subPositionOrder: string[];
  big5Leagues: string[];
}

/* ─── Constants ─── */

const DEFAULT_FILTERS: FilterState = {
  nationality_name: [],
  position_group: [],
  league_name: [],
  rating_tier: [],
  fifa_version: [],
  is_starter: null,
  football_year_type: [],
};

const EMPTY_FILTER_OPTIONS: FilterOptions = {
  nationality_name: [],
  position_group: [],
  league_name: [],
  rating_tier: [],
  fifa_version: [],
  football_year_type: [],
};

function hasAnyFilter(filters: FilterState): boolean {
  return (
    filters.nationality_name.length > 0 ||
    filters.position_group.length > 0 ||
    filters.league_name.length > 0 ||
    filters.rating_tier.length > 0 ||
    filters.fifa_version.length > 0 ||
    filters.is_starter !== null ||
    filters.football_year_type.length > 0
  );
}

function buildFilterBody(filters: FilterState): Record<string, unknown> {
  const body: Record<string, unknown> = {};
  if (filters.nationality_name.length > 0) body.nationality_name = filters.nationality_name;
  if (filters.position_group.length > 0) body.position_group = filters.position_group;
  if (filters.league_name.length > 0) body.league_name = filters.league_name;
  if (filters.rating_tier.length > 0) body.rating_tier = filters.rating_tier;
  if (filters.fifa_version.length > 0) body.fifa_version = filters.fifa_version;
  if (filters.is_starter !== null) body.is_starter = filters.is_starter;
  if (filters.football_year_type.length > 0) body.football_year_type = filters.football_year_type;
  return body;
}

/**
 * Height data hook. Uses internal state for filters (no URL params).
 * Calls POST /api/height on mount (empty filters) and on every filter change.
 */
export function useHeightData() {
  const [filters, setFiltersState] = useState<FilterState>(DEFAULT_FILTERS);
  const [data, setData] = useState<HeightData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [filterOptions, setFilterOptions] = useState<FilterOptions>(EMPTY_FILTER_OPTIONS);
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const abortRef = useRef<AbortController | null>(null);

  const hasActiveFilters = hasAnyFilter(filters);

  // Load filter options from dashboard_meta.json once on mount
  useEffect(() => {
    let cancelled = false;
    fetch("/data/dashboard_meta.json")
      .then((res) => res.json())
      .then((meta: { filterOptions: FilterOptions }) => {
        if (!cancelled) setFilterOptions(meta.filterOptions);
      })
      .catch((err) => console.error("Failed to load filter options:", err));
    return () => {
      cancelled = true;
    };
  }, []);

  // Fetch height data from API whenever filters change (including initial mount)
  useEffect(() => {
    if (debounceRef.current) clearTimeout(debounceRef.current);
    if (abortRef.current) abortRef.current.abort();

    setIsLoading(true);

    const delay = data === null ? 0 : 200; // No debounce on first load

    debounceRef.current = setTimeout(() => {
      const controller = new AbortController();
      abortRef.current = controller;

      const filterBody = buildFilterBody(filters);

      fetch("/api/height", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ filters: filterBody }),
        signal: controller.signal,
      })
        .then((res) => {
          if (!res.ok) throw new Error(`API error: ${res.status}`);
          return res.json();
        })
        .then((json: HeightData) => {
          setData(json);
          setIsLoading(false);
        })
        .catch((err) => {
          if (err.name !== "AbortError") {
            console.error("Failed to fetch height data:", err);
            setIsLoading(false);
          }
        });
    }, delay);

    return () => {
      if (debounceRef.current) clearTimeout(debounceRef.current);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filters]);

  const setFilter = useCallback(
    (key: keyof FilterState, value: FilterState[keyof FilterState]) => {
      setFiltersState((prev) => ({ ...prev, [key]: value }));
    },
    []
  );

  const clearFilters = useCallback(() => {
    setFiltersState(DEFAULT_FILTERS);
  }, []);

  return {
    data,
    isLoading,
    filters,
    setFilter,
    clearFilters,
    filterOptions,
    hasActiveFilters,
  };
}
