"use client";

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from "recharts";
import SectionWrapper from "../SectionWrapper";

interface CountryRepData {
  country: string;
  total_players: number;
  top_players: number;
  top_pct: number;
}

interface CountryRepresentationChartProps {
  data: CountryRepData[];
}

function getBarColor(pct: number): string {
  if (pct >= 2.5) return "#1e3a5f"; // navy — elite
  if (pct >= 1.0) return "#3b82f6"; // blue — strong
  if (pct >= 0.3) return "#f59e0b"; // amber — moderate
  return "#d1d5db"; // gray — low
}

export default function CountryRepresentationChart({
  data,
}: CountryRepresentationChartProps) {
  const sorted = [...data].sort((a, b) => b.top_pct - a.top_pct);

  return (
    <SectionWrapper
      id="country-representation"
      title="Top-Tier Country Representation"
      subtitle="What percentage of each country's players are rated 80+? Brazil and Spain lead — most large nations convert fewer than 1% of their players to elite status."
    >
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
        {/* Legend */}
        <div className="flex flex-wrap gap-4 mb-4 text-xs">
          <span className="flex items-center gap-1.5">
            <span className="w-3 h-3 rounded-sm inline-block" style={{ backgroundColor: "#1e3a5f" }} />
            Elite (&ge;2.5%)
          </span>
          <span className="flex items-center gap-1.5">
            <span className="w-3 h-3 rounded-sm inline-block" style={{ backgroundColor: "#3b82f6" }} />
            Strong (1-2.5%)
          </span>
          <span className="flex items-center gap-1.5">
            <span className="w-3 h-3 rounded-sm inline-block" style={{ backgroundColor: "#f59e0b" }} />
            Moderate (0.3-1%)
          </span>
          <span className="flex items-center gap-1.5">
            <span className="w-3 h-3 rounded-sm inline-block" style={{ backgroundColor: "#d1d5db" }} />
            Low (&lt;0.3%)
          </span>
        </div>

        <ResponsiveContainer width="100%" height={Math.max(sorted.length * 28, 400)}>
          <BarChart data={sorted} layout="vertical" barSize={18}>
            <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
            <XAxis
              type="number"
              domain={[0, 3.5]}
              tickFormatter={(v: number) => `${v}%`}
              tick={{ fontSize: 12 }}
              label={{
                value: "% of country's players rated 80+",
                position: "insideBottom",
                offset: -5,
                fontSize: 11,
                fill: "#9CA3AF",
              }}
            />
            <YAxis
              type="category"
              dataKey="country"
              width={140}
              tick={{ fontSize: 11 }}
            />
            <Tooltip
              formatter={(value: number, _name: string, props: { payload?: CountryRepData }) => {
                const p = props?.payload;
                return [
                  `${value}% (${p?.top_players ?? 0} of ${p?.total_players?.toLocaleString() ?? 0} players)`,
                  "Top-tier rate",
                ];
              }}
            />
            <Bar dataKey="top_pct" radius={[0, 4, 4, 0]}>
              {sorted.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={getBarColor(entry.top_pct)} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>

        <div className="mt-4 bg-blue-50 border border-blue-100 rounded-lg p-4 text-sm text-blue-800">
          <strong>Insight:</strong> Countries with large player pools (England: {data.find(d => d.country === "England")?.total_players.toLocaleString()}, Argentina: {data.find(d => d.country === "Argentina")?.total_players.toLocaleString()}) don&apos;t necessarily produce the highest % of elite players. Brazil ({data.find(d => d.country === "Brazil")?.top_pct}%) and Spain ({data.find(d => d.country === "Spain")?.top_pct}%) convert at 3-6x the rate of England ({data.find(d => d.country === "England")?.top_pct}%).
        </div>
      </div>
    </SectionWrapper>
  );
}
