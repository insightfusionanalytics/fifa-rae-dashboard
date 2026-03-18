"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import type { FilterState, FilterOptions } from "@/lib/types";

interface ProfileData {
  totalPlayers: number;
  modalPlayer: any;
  footAnalysis: any;
  countryRepresentation: any[];
  medianStats: any;
  splits: any;
  big5Leagues: string[];
  leftHandPopulationPct: number;
}

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
 * Profile data hook. Uses internal state for filters (no URL params).
 * Calls POST /api/profile on mount (empty filters) and on every filter change.
 */
export function useProfileData() {
  const [filters, setFiltersState] = useState<FilterState>(DEFAULT_FILTERS);
  const [data, setData] = useState<ProfileData | null>(null);
  const [unfilteredData, setUnfilteredData] = useState<ProfileData | null>(null);
  const [filterOptions, setFilterOptions] = useState<FilterOptions>(EMPTY_FILTER_OPTIONS);
  const [isLoading, setIsLoading] = useState(true);
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const abortRef = useRef<AbortController | null>(null);
  const mountedRef = useRef(true);

  const hasActiveFilters = hasAnyFilter(filters);

  // Load filter options from dashboard_meta.json once on mount
  useEffect(() => {
    fetch("/data/dashboard_meta.json")
      .then((res) => res.json())
      .then((meta) => {
        if (mountedRef.current && meta.filterOptions) {
          setFilterOptions(meta.filterOptions);
        }
      })
      .catch((err) => console.error("Failed to load filter options:", err));

    return () => {
      mountedRef.current = false;
    };
  }, []);

  // Load unfiltered data on mount
  useEffect(() => {
    const controller = new AbortController();
    fetch("/api/profile", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ filters: {} }),
      signal: controller.signal,
    })
      .then((res) => res.json())
      .then((result: ProfileData) => {
        if (mountedRef.current) {
          setUnfilteredData(result);
          setData(result);
          setIsLoading(false);
        }
      })
      .catch((err) => {
        if (err.name !== "AbortError") {
          console.error("Failed to load unfiltered profile data:", err);
          setIsLoading(false);
        }
      });

    return () => controller.abort();
  }, []);

  // Fetch filtered data when filters change
  useEffect(() => {
    if (!unfilteredData) return;

    if (!hasActiveFilters) {
      setData(unfilteredData);
      setIsLoading(false);
      return;
    }

    if (debounceRef.current) clearTimeout(debounceRef.current);
    if (abortRef.current) abortRef.current.abort();

    setIsLoading(true);

    debounceRef.current = setTimeout(() => {
      const controller = new AbortController();
      abortRef.current = controller;

      fetch("/api/profile", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ filters: buildFilterBody(filters) }),
        signal: controller.signal,
      })
        .then((res) => res.json())
        .then((result: ProfileData) => {
          if (mountedRef.current) {
            setData(result);
            setIsLoading(false);
          }
        })
        .catch((err) => {
          if (err.name !== "AbortError") {
            console.error("Failed to fetch filtered profile data:", err);
            if (mountedRef.current) setIsLoading(false);
          }
        });
    }, 200);

    return () => {
      if (debounceRef.current) clearTimeout(debounceRef.current);
    };
  }, [unfilteredData, hasActiveFilters, filters]);

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
