"use client";

import { useCallback } from "react";
import { useDashboardData } from "@/hooks/useDashboardData";
import DashboardHeader from "@/components/DashboardHeader";
import FilterBar from "@/components/FilterBar";
import ActiveFilters from "@/components/ActiveFilters";
import OverallChart from "@/components/OverallChart";
import PositionChart from "@/components/PositionChart";
import RatingChart from "@/components/RatingChart";
import LeagueChart from "@/components/LeagueChart";
import CountryChart from "@/components/CountryChart";
import PlayerTable from "@/components/PlayerTable";
import Methodology from "@/components/Methodology";
import SectionWrapper from "@/components/SectionWrapper";
import type { FilterState } from "@/lib/types";


function LoadingOverlay() {
  return (
    <div className="absolute inset-0 bg-white/60 backdrop-blur-[1px] flex items-center justify-center z-10 rounded-xl">
      <div className="flex items-center gap-2 bg-white/90 px-4 py-2 rounded-lg shadow-sm border border-gray-100">
        <div className="w-4 h-4 border-2 border-blue-500 border-t-transparent rounded-full animate-spin" />
        <span className="text-sm text-gray-600">Updating...</span>
      </div>
    </div>
  );
}

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

export default function ClientPage() {
  const {
    data,
    unfilteredData,
    isLoading,
    filters,
    setFilter,
    clearFilters,
    filterOptions,
    hasActiveFilters,
  } = useDashboardData();

  const handleFilterChange = useCallback(
    (key: keyof FilterState, value: FilterState[keyof FilterState]) => {
      setFilter(key, value);
    },
    [setFilter]
  );

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

  // Show full-page skeleton while meta is loading
  if (!data && !unfilteredData) {
    return (
      <main className="min-h-screen">
        <div className="bg-navy pt-8 pb-14 px-4">
          <div className="max-w-6xl mx-auto">
            <div className="h-6 w-48 bg-white/10 rounded animate-pulse mx-auto mb-4" />
            <div className="h-10 w-80 bg-white/10 rounded animate-pulse mx-auto mb-8" />
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="h-24 bg-white/5 rounded-xl animate-pulse" />
              ))}
            </div>
          </div>
        </div>
        <SkeletonSection />
        <SkeletonSection />
      </main>
    );
  }

  const displayData = data ?? unfilteredData!;
  const baseData = unfilteredData!;

  return (
    <main className="min-h-screen">
      {/* Dashboard Header */}
      <DashboardHeader
        data={displayData}
        unfilteredData={baseData}
        hasActiveFilters={hasActiveFilters}
      />

      {/* Filter Bar */}
      <FilterBar
        filters={filters}
        filterOptions={filterOptions}
        onFilterChange={handleFilterChange}
        onClearAll={clearFilters}
        hasActiveFilters={hasActiveFilters}
      />

      {/* Active Filter Pills */}
      {hasActiveFilters && (
        <ActiveFilters
          filters={filters}
          totalFiltered={displayData.overview.totalPlayers}
          totalAll={baseData.overview.totalPlayers}
          onRemove={handleRemoveFilter}
          onClearAll={clearFilters}
        />
      )}

      {/* Charts */}
      <div className="relative">
        {isLoading && <LoadingOverlay />}

        <OverallChart
          quarters={displayData.overallQuarters}
          months={displayData.overallMonths}
        />

        <div className="bg-gray-50">
          <PositionChart data={displayData.byPosition} />
        </div>

        <RatingChart data={displayData.byDecile} />

        <div className="bg-gray-50">
          <LeagueChart data={displayData.byLeague} />
        </div>

        <CountryChart data={displayData.byCountry} />
      </div>

      {/* Player Table */}
      <div className="bg-gray-50">
        <SectionWrapper id="players" title="Player Explorer" subtitle="Search, sort, and explore individual player data with the current filters applied.">
          <PlayerTable filters={filters} />
        </SectionWrapper>
      </div>

      {/* Methodology */}
      <div className="bg-gray-50">
        <Methodology overview={displayData.overview} tiers={displayData.tierComparison} />
      </div>
    </main>
  );
}
