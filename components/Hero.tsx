"use client";

import StatCard from "./StatCard";
import type { Overview, QuarterData } from "@/lib/types";

interface HeroProps {
  overview: Overview;
  quarters: QuarterData;
}

const NAV_ITEMS = [
  { label: "Overall", href: "#overall" },
  { label: "By Position", href: "#position" },
  { label: "By Rating", href: "#rating" },
  { label: "By League", href: "#league" },
  { label: "By Country", href: "#country" },
  { label: "Methodology", href: "#methodology" },
];

export default function Hero({ overview, quarters }: HeroProps) {
  return (
    <>
      {/* Navigation */}
      <nav className="sticky top-0 z-50 bg-navy/95 backdrop-blur-sm border-b border-white/10">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-14">
            <span className="text-white font-semibold text-sm sm:text-base">
              FIFA RAE Analysis
            </span>
            <div className="hidden md:flex items-center gap-1">
              {NAV_ITEMS.map((item) => (
                <a
                  key={item.href}
                  href={item.href}
                  className="text-gray-300 hover:text-white text-sm px-3 py-1.5 rounded transition-colors"
                >
                  {item.label}
                </a>
              ))}
            </div>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <header className="bg-navy text-white pt-16 pb-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto text-center">
          <p className="text-sm font-medium tracking-widest uppercase text-blue-300 mb-4">
            Insight Fusion Analytics
          </p>
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold leading-tight">
            FIFA Player Analysis
          </h1>
          <p className="mt-3 text-lg sm:text-xl text-gray-300 max-w-2xl mx-auto">
            Relative Age Effect Across Professional Football
          </p>
          <p className="mt-2 text-sm text-gray-400">
            FIFA {overview.fifaVersions[0]}&ndash;
            {overview.fifaVersions[overview.fifaVersions.length - 1]} |{" "}
            {overview.totalPlayers.toLocaleString()} unique players
          </p>
        </div>
      </header>

      {/* Stat Cards */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 -mt-10">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <StatCard
            label="Players"
            value={overview.totalPlayers.toLocaleString()}
            detail={`FIFA ${overview.fifaVersions[0]}-${overview.fifaVersions[overview.fifaVersions.length - 1]}`}
          />
          <StatCard
            label="Countries"
            value={overview.nationalities}
            detail={`${overview.leagues} leagues`}
          />
          <StatCard
            label="Q1 Share"
            value={`${quarters.values[0]}%`}
            detail="Expected: 25%"
          />
          <StatCard
            label="Chi-squared"
            value={quarters.stats.chi2.toFixed(0)}
            detail={`p < 0.001 (n=${quarters.stats.n.toLocaleString()})`}
          />
        </div>
      </div>
    </>
  );
}
