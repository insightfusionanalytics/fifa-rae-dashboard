"use client";

import { useCallback } from "react";
import StatCard from "@/components/StatCard";
import FilterBar from "@/components/FilterBar";
import ActiveFilters from "@/components/ActiveFilters";
import PositionHeightChart from "@/components/height/PositionHeightChart";
import TopVsAllChart from "@/components/height/TopVsAllChart";
import CountryComparisonChart from "@/components/height/CountryComparisonChart";
import RatingHeightChart from "@/components/height/RatingHeightChart";
import LeagueTierHeight from "@/components/height/LeagueTierHeight";
import { useHeightData } from "@/hooks/useHeightData";
import type { FilterState } from "@/lib/types";

function LoadingSkeleton() {
  return (
    <div className="animate-pulse space-y-12">
      {/* Header skeleton */}
      <div className="bg-navy text-white pt-8 pb-14 px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-8">
            <div className="h-3 w-40 bg-blue-400/30 rounded mx-auto mb-3" />
            <div className="h-8 w-64 bg-white/20 rounded mx-auto mb-2" />
            <div className="h-4 w-80 bg-white/10 rounded mx-auto" />
          </div>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            {[1, 2, 3, 4].map((i) => (
              <div
                key={i}
                className="bg-white/10 rounded-xl h-24 animate-pulse"
              />
            ))}
          </div>
        </div>
      </div>

      {/* Chart skeletons */}
      {[1, 2, 3, 4, 5].map((i) => (
        <div key={i} className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="h-6 w-48 bg-gray-200 rounded mb-2" />
          <div className="h-4 w-96 bg-gray-100 rounded mb-6" />
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
            <div className="h-[400px] bg-gray-50 rounded" />
          </div>
        </div>
      ))}
    </div>
  );
}

function LoadingOverlay() {
  return (
    <div className="absolute inset-0 bg-white/60 backdrop-blur-[1px] z-10 flex items-center justify-center rounded-xl">
      <div className="flex items-center gap-2 text-sm text-gray-500 font-medium">
        <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24" fill="none">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
        </svg>
        Updating...
      </div>
    </div>
  );
}

export default function HeightClient() {
  const {
    data,
    isLoading,
    filters,
    setFilter,
    clearFilters,
    filterOptions,
    hasActiveFilters,
  } = useHeightData();

  const handleRemoveFilter = useCallback(
    (key: keyof FilterState, value: string | number | boolean) => {
      if (key === "is_starter") {
        setFilter("is_starter", null);
      } else if (key === "fifa_version") {
        setFilter(
          "fifa_version",
          filters.fifa_version.filter((v) => v !== value)
        );
      } else {
        const current = filters[key] as string[];
        setFilter(key, current.filter((v) => v !== value));
      }
    },
    [filters, setFilter]
  );

  // Initial load — no data yet
  if (!data && isLoading) {
    return <LoadingSkeleton />;
  }

  if (!data) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-500 text-lg font-medium">
            Failed to load height data
          </p>
          <p className="text-gray-400 text-sm mt-1">
            Please try refreshing the page.
          </p>
        </div>
      </div>
    );
  }

  // Derive header stats
  const tallestPos = [...data.bySubPosition].sort(
    (a, b) => b.avg_height - a.avg_height
  )[0];
  const shortestPos = [...data.bySubPosition].sort(
    (a, b) => a.avg_height - b.avg_height
  )[0];

  return (
    <main className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-navy text-white pt-8 pb-14 px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-8">
            <p className="text-xs font-medium tracking-widest uppercase text-blue-300 mb-2">
              Insight Fusion Analytics
            </p>
            <h1 className="text-2xl sm:text-3xl font-bold leading-tight">
              Height Analysis
            </h1>
            <p className="mt-1 text-sm text-gray-400">
              Height distributions across positions, ratings, countries, and
              league tiers
            </p>
          </div>

          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            <StatCard
              label="Players"
              value={data.totalPlayers.toLocaleString()}
              detail={hasActiveFilters ? "filtered dataset" : "FIFA 15-23 dataset"}
            />
            <StatCard
              label="Avg Height"
              value={`${data.overallAvgHeight} cm`}
              detail={`Median: ${data.overallMedianHeight} cm`}
            />
            <StatCard
              label="Tallest Position"
              value={tallestPos?.position ?? "—"}
              detail={tallestPos ? `${tallestPos.avg_height.toFixed(1)} cm avg` : "—"}
            />
            <StatCard
              label="Shortest Position"
              value={shortestPos?.position ?? "—"}
              detail={shortestPos ? `${shortestPos.avg_height.toFixed(1)} cm avg` : "—"}
            />
          </div>
        </div>
      </header>

      {/* Filter Bar — sticky */}
      <FilterBar
        filters={filters}
        filterOptions={filterOptions}
        onFilterChange={setFilter}
        onClearAll={clearFilters}
        hasActiveFilters={hasActiveFilters}
      />

      {/* Active Filters */}
      {hasActiveFilters && (
        <ActiveFilters
          filters={filters}
          totalFiltered={data.totalPlayers}
          totalAll={data.totalPlayers} // will show same when no unfiltered baseline
          onRemove={handleRemoveFilter}
          onClearAll={clearFilters}
        />
      )}

      {/* Charts with loading overlay */}
      <div className="relative">
        {isLoading && data && <LoadingOverlay />}

        <PositionHeightChart data={data.bySubPosition} />

        <TopVsAllChart data={data.topVsAll} />

        <CountryComparisonChart
          data={data.topCountries}
          overallAvg={data.overallAvgHeight}
        />

        <RatingHeightChart
          data={data.byRatingDecile}
          overallAvg={data.overallAvgHeight}
        />

        <LeagueTierHeight
          data={data.byLeagueTier}
          big5Leagues={data.big5Leagues}
        />
      </div>

      {/* Footer */}
      <footer className="py-8 px-4 text-center text-sm text-gray-400 border-t border-gray-100">
        <p>FIFA Player Analysis — Insight Fusion Analytics — 2026</p>
        <p className="mt-1">
          Data sourced from EA Sports FIFA series. For research purposes only.
        </p>
      </footer>
    </main>
  );
}
