"use client";

import { useCallback } from "react";
import ModalPlayerCard from "@/components/profile/ModalPlayerCard";
import FootAnalysisChart from "@/components/profile/FootAnalysisChart";
import CountryRepresentationChart from "@/components/profile/CountryRepresentationChart";
import MedianStatsCard from "@/components/profile/MedianStatsCard";
import SplitComparisonChart from "@/components/profile/SplitComparisonChart";
import FilterBar from "@/components/FilterBar";
import ActiveFilters from "@/components/ActiveFilters";
import { useProfileData } from "@/hooks/useProfileData";
import type { FilterState } from "@/lib/types";

function SkeletonSection() {
  return (
    <div className="py-16 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto">
        <div className="h-8 w-64 bg-gray-200 rounded animate-pulse mb-4" />
        <div className="h-4 w-96 bg-gray-100 rounded animate-pulse mb-8" />
        <div className="h-[300px] bg-gray-50 rounded-xl animate-pulse" />
      </div>
    </div>
  );
}

function LoadingOverlay() {
  return (
    <div className="absolute inset-0 bg-white/60 backdrop-blur-[1px] z-10 flex items-center justify-center">
      <div className="flex items-center gap-2 bg-white/90 px-4 py-2 rounded-lg shadow-sm">
        <div className="w-4 h-4 border-2 border-blue-500 border-t-transparent rounded-full animate-spin" />
        <span className="text-sm text-gray-600 font-medium">Updating...</span>
      </div>
    </div>
  );
}

export default function ProfileClient() {
  const {
    data,
    unfilteredData,
    isLoading,
    filters,
    setFilter,
    clearFilters,
    filterOptions,
    hasActiveFilters,
  } = useProfileData();

  const handleRemoveFilter = useCallback(
    (key: keyof FilterState, value: string | number | boolean) => {
      if (key === "is_starter") {
        setFilter("is_starter", null);
        return;
      }
      if (key === "fifa_version") {
        setFilter(
          "fifa_version",
          filters.fifa_version.filter((v) => v !== value)
        );
        return;
      }
      const arrKey = key as "nationality_name" | "position_group" | "league_name" | "rating_tier" | "football_year_type";
      setFilter(
        arrKey,
        filters[arrKey].filter((v) => v !== value)
      );
    },
    [setFilter, filters]
  );

  // Loading skeleton — no data at all yet
  if (!data) {
    return (
      <main className="min-h-screen">
        {/* Header skeleton */}
        <header className="bg-navy text-white pt-8 pb-14 px-4 sm:px-6 lg:px-8">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-8">
              <div className="h-4 w-40 bg-white/10 rounded animate-pulse mx-auto mb-3" />
              <div className="h-8 w-72 bg-white/10 rounded animate-pulse mx-auto mb-2" />
              <div className="h-4 w-80 bg-white/10 rounded animate-pulse mx-auto" />
            </div>
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="h-24 bg-white/5 rounded-xl animate-pulse" />
              ))}
            </div>
          </div>
        </header>
        <SkeletonSection />
        <SkeletonSection />
        <SkeletonSection />
      </main>
    );
  }

  const footRatio = data.footAnalysis.ratio;

  return (
    <main className="min-h-screen">
      {/* Header */}
      <header className="bg-navy text-white pt-8 pb-14 px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-8">
            <p className="text-xs font-medium tracking-widest uppercase text-blue-300 mb-2">
              Insight Fusion Analytics
            </p>
            <h1 className="text-2xl sm:text-3xl font-bold leading-tight">
              Player Profile Analysis
            </h1>
            <p className="mt-1 text-sm text-gray-400">
              Common characteristics, foot dominance, and country representation across {data.totalPlayers.toLocaleString()} players
            </p>
          </div>

          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 text-center hover:shadow-md transition-shadow">
              <p className="text-sm font-medium text-gray-500 uppercase tracking-wide">Players</p>
              <p className="mt-2 text-3xl sm:text-4xl font-bold text-navy">{data.totalPlayers.toLocaleString()}</p>
              <p className="mt-1 text-xs text-gray-400">FIFA 15-23</p>
            </div>
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 text-center hover:shadow-md transition-shadow">
              <p className="text-sm font-medium text-gray-500 uppercase tracking-wide">Left-Footed</p>
              <p className="mt-2 text-3xl sm:text-4xl font-bold text-navy">{data.footAnalysis.overall.left_foot_pct}%</p>
              <p className="mt-1 text-xs text-gray-400">{data.footAnalysis.overall.left_foot_count.toLocaleString()} players</p>
            </div>
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 text-center hover:shadow-md transition-shadow">
              <p className="text-sm font-medium text-gray-500 uppercase tracking-wide">Top Country</p>
              <p className="mt-2 text-3xl sm:text-4xl font-bold text-navy">{data.modalPlayer.country.value}</p>
              <p className="mt-1 text-xs text-gray-400">{data.modalPlayer.country.pct}% of all players</p>
            </div>
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 text-center hover:shadow-md transition-shadow">
              <p className="text-sm font-medium text-gray-500 uppercase tracking-wide">Foot vs Hand</p>
              <p className="mt-2 text-3xl sm:text-4xl font-bold text-navy">{footRatio}x</p>
              <p className="mt-1 text-xs text-gray-400">{data.footAnalysis.overall.left_foot_pct}% vs {data.leftHandPopulationPct}% left-handed</p>
            </div>
          </div>
        </div>
      </header>

      {/* Sticky Filter Bar */}
      <FilterBar
        filters={filters}
        filterOptions={filterOptions}
        onFilterChange={setFilter}
        onClearAll={clearFilters}
        hasActiveFilters={hasActiveFilters}
      />

      {/* Active Filters */}
      {hasActiveFilters && unfilteredData && (
        <ActiveFilters
          filters={filters}
          totalFiltered={data.totalPlayers}
          totalAll={unfilteredData.totalPlayers}
          onRemove={handleRemoveFilter}
          onClearAll={clearFilters}
        />
      )}

      {/* Modal Player Card */}
      <div className="bg-gray-50">
        <section className="py-16 px-4 sm:px-6 lg:px-8 relative">
          {isLoading && <LoadingOverlay />}
          <div className="max-w-6xl mx-auto">
            <div className="mb-8">
              <h2 className="text-2xl sm:text-3xl font-bold text-navy">The Modal Player</h2>
              <p className="mt-2 text-gray-500 text-sm sm:text-base">
                If you picked the single most common value for every attribute, this is the player you&apos;d get.
              </p>
              <div className="mt-3 h-1 w-16 bg-navy rounded" />
            </div>
            <ModalPlayerCard data={data.modalPlayer} />
          </div>
        </section>
      </div>

      {/* Foot Analysis */}
      <div className="relative">
        {isLoading && <LoadingOverlay />}
        <FootAnalysisChart data={data.footAnalysis} />
      </div>

      {/* Country Representation */}
      <div className="bg-gray-50 relative">
        {isLoading && <LoadingOverlay />}
        <CountryRepresentationChart data={data.countryRepresentation} />
      </div>

      {/* Median Stats */}
      <div className="relative">
        {isLoading && <LoadingOverlay />}
        <MedianStatsCard data={data.medianStats} />
      </div>

      {/* Split Comparisons */}
      <div className="bg-gray-50 relative">
        {isLoading && <LoadingOverlay />}
        <SplitComparisonChart data={data.splits} />
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
