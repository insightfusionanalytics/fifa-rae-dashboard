"use client";

import { useState, useEffect } from "react";
import StatCard from "@/components/StatCard";
import PositionHeightChart from "@/components/height/PositionHeightChart";
import TopVsAllChart from "@/components/height/TopVsAllChart";
import CountryComparisonChart from "@/components/height/CountryComparisonChart";
import RatingHeightChart from "@/components/height/RatingHeightChart";
import LeagueTierHeight from "@/components/height/LeagueTierHeight";

interface HeightMeta {
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

export default function HeightClient() {
  const [data, setData] = useState<HeightMeta | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetch("/data/height_meta.json")
      .then((res) => {
        if (!res.ok) throw new Error(`Failed to load data: ${res.status}`);
        return res.json();
      })
      .then((json: HeightMeta) => setData(json))
      .catch((err: Error) => setError(err.message));
  }, []);

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-500 text-lg font-medium">
            Failed to load height data
          </p>
          <p className="text-gray-400 text-sm mt-1">{error}</p>
        </div>
      </div>
    );
  }

  if (!data) {
    return <LoadingSkeleton />;
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
              detail="FIFA 15-23 dataset"
            />
            <StatCard
              label="Avg Height"
              value={`${data.overallAvgHeight} cm`}
              detail={`Median: ${data.overallMedianHeight} cm`}
            />
            <StatCard
              label="Tallest Position"
              value={tallestPos.position}
              detail={`${tallestPos.avg_height.toFixed(1)} cm avg`}
            />
            <StatCard
              label="Shortest Position"
              value={shortestPos.position}
              detail={`${shortestPos.avg_height.toFixed(1)} cm avg`}
            />
          </div>
        </div>
      </header>

      {/* Charts */}
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
