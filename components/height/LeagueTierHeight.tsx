"use client";

import SectionWrapper from "../SectionWrapper";

interface LeagueTierData {
  big_5: { avg_height: number; count: number };
  rest: { avg_height: number; count: number };
}

interface LeagueTierHeightProps {
  data: LeagueTierData;
  big5Leagues: string[];
}

export default function LeagueTierHeight({
  data,
  big5Leagues,
}: LeagueTierHeightProps) {
  const diff = (data.big_5.avg_height - data.rest.avg_height).toFixed(1);

  return (
    <SectionWrapper
      id="league-tier"
      title="Big 5 Leagues vs Rest of the World"
      subtitle={`Players in the Big 5 leagues are ${diff} cm taller on average — a small but statistically meaningful difference across ${(data.big_5.count + data.rest.count).toLocaleString()} players.`}
    >
      <div className="grid sm:grid-cols-2 gap-6">
        {/* Big 5 card */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-8 text-center">
          <div className="inline-flex items-center justify-center w-14 h-14 rounded-full bg-navy/10 mb-4">
            <svg
              className="w-7 h-7 text-navy"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z"
              />
            </svg>
          </div>
          <p className="text-sm font-medium text-gray-500 uppercase tracking-wide mb-2">
            Big 5 Leagues
          </p>
          <p className="text-4xl font-bold text-navy">
            {data.big_5.avg_height.toFixed(1)} cm
          </p>
          <p className="mt-2 text-xs text-gray-400">
            {data.big_5.count.toLocaleString()} players
          </p>
          <div className="mt-4 flex flex-wrap gap-1 justify-center">
            {big5Leagues.map((league) => (
              <span
                key={league}
                className="text-xs bg-navy/5 text-navy/70 px-2 py-0.5 rounded"
              >
                {league}
              </span>
            ))}
          </div>
        </div>

        {/* Rest card */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-8 text-center">
          <div className="inline-flex items-center justify-center w-14 h-14 rounded-full bg-gray-100 mb-4">
            <svg
              className="w-7 h-7 text-gray-500"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
          </div>
          <p className="text-sm font-medium text-gray-500 uppercase tracking-wide mb-2">
            All Other Leagues
          </p>
          <p className="text-4xl font-bold text-gray-700">
            {data.rest.avg_height.toFixed(1)} cm
          </p>
          <p className="mt-2 text-xs text-gray-400">
            {data.rest.count.toLocaleString()} players
          </p>
          <div className="mt-4">
            <span className="text-xs bg-gray-50 text-gray-500 px-2 py-0.5 rounded">
              39 other leagues
            </span>
          </div>
        </div>
      </div>

      {/* Comparison bar */}
      <div className="mt-6 bg-white rounded-xl shadow-sm border border-gray-100 p-6">
        <div className="flex items-center justify-between text-sm text-gray-600 mb-3">
          <span>Height difference</span>
          <span className="font-semibold text-navy">+{diff} cm</span>
        </div>
        <div className="w-full bg-gray-100 rounded-full h-3 overflow-hidden">
          <div
            className="h-full rounded-full bg-gradient-to-r from-navy to-blue-500"
            style={{
              width: `${((data.big_5.avg_height - 178) / (184 - 178)) * 100}%`,
            }}
          />
        </div>
        <div className="flex justify-between text-xs text-gray-400 mt-1">
          <span>178 cm</span>
          <span>184 cm</span>
        </div>
      </div>
    </SectionWrapper>
  );
}
