"use client";

import SectionWrapper from "../SectionWrapper";

interface RatingTier {
  median_birth_month: number;
  median_birth_month_name: string;
  median_height: number;
  count: number;
}

interface MedianStatsData {
  overall: {
    median_birth_month: number;
    median_birth_month_name: string;
    median_height: number;
  };
  byRating: {
    [tier: string]: RatingTier;
  };
  big5: {
    median_birth_month: number;
    median_height: number;
    count: number;
  };
  rest: {
    median_birth_month: number;
    median_height: number;
    count: number;
  };
}

interface MedianStatsCardProps {
  data: MedianStatsData;
}

const MONTH_NAMES = [
  "", "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December",
];

export default function MedianStatsCard({ data }: MedianStatsCardProps) {
  const ratingTiers = ["Top 20%", "Middle", "Bottom 20%"];

  return (
    <SectionWrapper
      id="median-stats"
      title="Median Player Statistics"
      subtitle="Median birth month and height across rating tiers and league tiers. Top 20% players are 1 cm taller on average, and Big 5 league players are 2 cm taller than the rest."
    >
      <div className="grid lg:grid-cols-2 gap-8">
        {/* By Rating Tier */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <h3 className="text-sm font-semibold text-gray-700 mb-1">
            By Rating Tier
          </h3>
          <p className="text-xs text-gray-400 mb-4">
            How median stats shift across player quality
          </p>

          {/* Overall row */}
          <div className="bg-navy/5 rounded-lg p-4 mb-4">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-xs text-gray-500 uppercase tracking-wide">Overall Median</div>
                <div className="text-sm font-semibold text-navy mt-0.5">
                  All {data.overall.median_birth_month_name ? data.overall.median_birth_month_name : MONTH_NAMES[data.overall.median_birth_month]} birth month
                </div>
              </div>
              <div className="text-right">
                <div className="text-2xl font-bold text-navy">{data.overall.median_height}</div>
                <div className="text-[10px] uppercase tracking-wide text-gray-400">cm height</div>
              </div>
            </div>
          </div>

          {/* Tier rows */}
          <div className="space-y-2">
            {ratingTiers.map((tier) => {
              const tierData = data.byRating[tier];
              if (!tierData) return null;
              const isTop = tier === "Top 20%";
              return (
                <div
                  key={tier}
                  className={`flex items-center justify-between rounded-lg px-4 py-3 ${
                    isTop ? "bg-green-50 border border-green-100" : "bg-gray-50"
                  }`}
                >
                  <div>
                    <div className={`text-sm font-semibold ${isTop ? "text-green-700" : "text-gray-700"}`}>
                      {tier}
                    </div>
                    <div className="text-xs text-gray-400">
                      {tierData.count.toLocaleString()} players
                    </div>
                  </div>
                  <div className="flex gap-6 text-right">
                    <div>
                      <div className="text-sm font-semibold text-gray-700">
                        {tierData.median_birth_month_name || MONTH_NAMES[tierData.median_birth_month]}
                      </div>
                      <div className="text-[10px] text-gray-400">Birth Month</div>
                    </div>
                    <div>
                      <div className={`text-sm font-semibold ${isTop ? "text-green-700" : "text-gray-700"}`}>
                        {tierData.median_height} cm
                      </div>
                      <div className="text-[10px] text-gray-400">Height</div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* By League Tier */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <h3 className="text-sm font-semibold text-gray-700 mb-1">
            By League Tier
          </h3>
          <p className="text-xs text-gray-400 mb-4">
            Big 5 leagues vs all other leagues
          </p>

          <div className="space-y-4">
            {/* Big 5 */}
            <div className="bg-navy/5 rounded-lg p-5">
              <div className="flex items-center justify-between mb-3">
                <div>
                  <div className="text-sm font-semibold text-navy">Big 5 Leagues</div>
                  <div className="text-xs text-gray-400">
                    Premier League, La Liga, Bundesliga, Serie A, Ligue 1
                  </div>
                </div>
                <div className="text-xs text-gray-400">
                  {data.big5.count.toLocaleString()} players
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-white rounded-lg p-3 text-center">
                  <div className="text-2xl font-bold text-navy">{data.big5.median_height}</div>
                  <div className="text-[10px] uppercase tracking-wide text-gray-400">cm median height</div>
                </div>
                <div className="bg-white rounded-lg p-3 text-center">
                  <div className="text-2xl font-bold text-navy">{MONTH_NAMES[data.big5.median_birth_month]}</div>
                  <div className="text-[10px] uppercase tracking-wide text-gray-400">median birth month</div>
                </div>
              </div>
            </div>

            {/* Rest */}
            <div className="bg-gray-50 rounded-lg p-5">
              <div className="flex items-center justify-between mb-3">
                <div>
                  <div className="text-sm font-semibold text-gray-700">All Other Leagues</div>
                  <div className="text-xs text-gray-400">
                    39 other leagues
                  </div>
                </div>
                <div className="text-xs text-gray-400">
                  {data.rest.count.toLocaleString()} players
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-white rounded-lg p-3 text-center">
                  <div className="text-2xl font-bold text-gray-700">{data.rest.median_height}</div>
                  <div className="text-[10px] uppercase tracking-wide text-gray-400">cm median height</div>
                </div>
                <div className="bg-white rounded-lg p-3 text-center">
                  <div className="text-2xl font-bold text-gray-700">{MONTH_NAMES[data.rest.median_birth_month]}</div>
                  <div className="text-[10px] uppercase tracking-wide text-gray-400">median birth month</div>
                </div>
              </div>
            </div>

            {/* Delta callout */}
            <div className="bg-amber-50 border border-amber-100 rounded-lg p-3 text-center text-sm text-amber-800">
              Big 5 players are <strong>{(data.big5.median_height - data.rest.median_height).toFixed(0)} cm taller</strong> at the median than players in other leagues
            </div>
          </div>
        </div>
      </div>
    </SectionWrapper>
  );
}
