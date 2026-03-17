"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import type { RaeData, FilterState, FilterOptions, DashboardMeta } from "@/lib/types";

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

function filtersFromParams(params: URLSearchParams): FilterState {
  const arrayParam = (key: string): string[] => {
    const val = params.get(key);
    return val ? val.split(",").filter(Boolean) : [];
  };

  const fifaRaw = params.get("fifa_version");
  const fifaVersions = fifaRaw
    ? fifaRaw.split(",").map(Number).filter((n) => !isNaN(n))
    : [];

  const starterRaw = params.get("is_starter");
  const is_starter = starterRaw === "true" ? true : starterRaw === "false" ? false : null;

  return {
    nationality_name: arrayParam("nationality_name"),
    position_group: arrayParam("position_group"),
    league_name: arrayParam("league_name"),
    rating_tier: arrayParam("rating_tier"),
    fifa_version: fifaVersions,
    is_starter,
    football_year_type: arrayParam("football_year_type"),
  };
}

function filtersToParams(filters: FilterState): string {
  const parts: string[] = [];

  const arrayKeys = [
    "nationality_name",
    "position_group",
    "league_name",
    "rating_tier",
    "football_year_type",
  ] as const;

  for (const key of arrayKeys) {
    const arr = filters[key];
    if (arr.length > 0) {
      parts.push(`${key}=${encodeURIComponent(arr.join(","))}`);
    }
  }

  if (filters.fifa_version.length > 0) {
    parts.push(`fifa_version=${filters.fifa_version.join(",")}`);
  }

  if (filters.is_starter !== null) {
    parts.push(`is_starter=${filters.is_starter}`);
  }

  return parts.length > 0 ? `?${parts.join("&")}` : "";
}

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

/**
 * Dashboard data hook. Uses internal state for filters to avoid
 * the useSearchParams → router.push re-render cycle. URL is synced
 * as a side-effect only.
 */
export function useDashboardData() {
  // Internal filter state — this is the source of truth
  const [filters, setFiltersState] = useState<FilterState>(() => {
    // Initialize from URL on first render (client-side only)
    if (typeof window !== "undefined") {
      return filtersFromParams(new URLSearchParams(window.location.search));
    }
    return DEFAULT_FILTERS;
  });

  const [meta, setMeta] = useState<DashboardMeta | null>(null);
  const [filteredData, setFilteredData] = useState<RaeData | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const abortRef = useRef<AbortController | null>(null);

  const hasActiveFilters = hasAnyFilter(filters);

  // Sync filters → URL (side-effect only, does NOT re-derive state from URL)
  useEffect(() => {
    const qs = filtersToParams(filters);
    const newUrl = `/${qs}`;
    // Use replaceState to avoid adding to browser history on every filter change
    // and critically, to avoid triggering Next.js router re-renders
    window.history.replaceState(null, "", newUrl);
  }, [filters]);

  // Load dashboard meta on mount
  useEffect(() => {
    let cancelled = false;
    fetch("/data/dashboard_meta.json")
      .then((res) => res.json())
      .then((data: DashboardMeta) => {
        if (!cancelled) setMeta(data);
      })
      .catch((err) => console.error("Failed to load dashboard meta:", err));
    return () => {
      cancelled = true;
    };
  }, []);

  // Fetch filtered data when filters change
  useEffect(() => {
    if (!meta) return;

    if (!hasActiveFilters) {
      setFilteredData(null);
      setIsLoading(false);
      return;
    }

    if (debounceRef.current) clearTimeout(debounceRef.current);
    if (abortRef.current) abortRef.current.abort();

    setIsLoading(true);

    debounceRef.current = setTimeout(() => {
      const controller = new AbortController();
      abortRef.current = controller;

      const filterBody: Record<string, unknown> = {};

      if (filters.nationality_name.length > 0) filterBody.nationality_name = filters.nationality_name;
      if (filters.position_group.length > 0) filterBody.position_group = filters.position_group;
      if (filters.league_name.length > 0) filterBody.league_name = filters.league_name;
      if (filters.rating_tier.length > 0) filterBody.rating_tier = filters.rating_tier;
      if (filters.fifa_version.length > 0) filterBody.fifa_version = filters.fifa_version;
      if (filters.is_starter !== null) filterBody.is_starter = filters.is_starter;
      if (filters.football_year_type.length > 0) filterBody.football_year_type = filters.football_year_type;

      fetch("/api/aggregate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ filters: filterBody }),
        signal: controller.signal,
      })
        .then((res) => res.json())
        .then((data: RaeData) => {
          setFilteredData(data);
          setIsLoading(false);
        })
        .catch((err) => {
          if (err.name !== "AbortError") {
            console.error("Failed to fetch filtered data:", err);
            setIsLoading(false);
          }
        });
    }, 200);

    return () => {
      if (debounceRef.current) clearTimeout(debounceRef.current);
    };
  }, [meta, hasActiveFilters, filters]);

  const data: RaeData | null = hasActiveFilters ? filteredData : meta?.unfiltered ?? null;
  const unfilteredData: RaeData | null = meta?.unfiltered ?? null;
  const filterOptions: FilterOptions = meta?.filterOptions ?? EMPTY_FILTER_OPTIONS;

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
    unfilteredData,
    isLoading,
    filters,
    setFilter,
    clearFilters,
    filterOptions,
    hasActiveFilters,
  };
}
