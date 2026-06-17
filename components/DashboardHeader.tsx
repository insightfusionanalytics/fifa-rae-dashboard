"use client";

import StatCard from "./StatCard";
import type { RaeData } from "@/lib/types";

interface DashboardHeaderProps {
  data: RaeData;
  unfilteredData: RaeData;
  hasActiveFilters: boolean;
}

function formatDelta(filtered: number, unfiltered: number, suffix = ""): string {
  if (!filtered || !unfiltered) return "";
  const delta = filtered - unfiltered;
  if (Math.abs(delta) < 0.05) return "";
  const sign = delta > 0 ? "+" : "";
  return `${sign}${delta.toFixed(1)}${suffix} vs all`;
}

export default function DashboardHeader({
  data,
  unfilteredData,
  hasActiveFilters,
}: DashboardHeaderProps) {
  const { overview, overallQuarters } = data;

  const q1Detail = hasActiveFilters
    ? `All: ${unfilteredData.overallQuarters.values[0]}% ${formatDelta(overallQuarters.values[0], unfilteredData.overallQuarters.values[0], "pp") ? "(" + formatDelta(overallQuarters.values[0], unfilteredData.overallQuarters.values[0], "pp") + ")" : ""}`
    : "Expected: 25%";

  const chiDetail = hasActiveFilters
    ? `n = ${overallQuarters.stats.n.toLocaleString()}`
    : `p < 0.001 (n=${overallQuarters.stats.n.toLocaleString()})`;

  return (
    <header className="bg-navy text-white pt-8 pb-14 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-8">
          <p className="text-xs font-medium tracking-widest uppercase text-blue-300 mb-2">
            Insight Fusion Analytics
          </p>
          <h1 className="text-2xl sm:text-3xl font-bold leading-tight">
            FIFA RAE Dashboard
          </h1>
          <p className="mt-1 text-sm text-gray-400">
            Relative Age Effect Across Professional Football
          </p>
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <StatCard
            label="Players"
            value={overview.totalPlayers.toLocaleString()}
            detail={
              hasActiveFilters
                ? `of ${unfilteredData.overview.totalPlayers.toLocaleString()} total`
                : `FIFA ${overview.fifaVersions[0]}-${overview.fifaVersions[overview.fifaVersions.length - 1]}`
            }
          />
          <StatCard
            label="Countries"
            value={overview.nationalities}
            detail={`${overview.leagues} leagues`}
          />
          <StatCard
            label="Q1 Share"
            value={`${overallQuarters.values[0] ?? 0}%`}
            detail={q1Detail}
          />
          <StatCard
            label="Chi-squared"
            value={overallQuarters.stats.chi2.toFixed(0)}
            detail={chiDetail}
          />
        </div>
      </div>
    </header>
  );
}
