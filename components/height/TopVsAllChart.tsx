"use client";

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";
import SectionWrapper from "../SectionWrapper";

interface TopVsAllData {
  position: string;
  all_avg: number;
  all_count: number;
  top_avg: number;
  top_count: number;
  diff: number;
}

interface TopVsAllChartProps {
  data: TopVsAllData[];
}

export default function TopVsAllChart({ data }: TopVsAllChartProps) {
  const chartData = data.map((d) => ({
    name: d.position,
    allPlayers: d.all_avg,
    topRated: d.top_avg,
    diff: d.diff,
    allCount: d.all_count,
    topCount: d.top_count,
  }));

  return (
    <SectionWrapper
      id="top-vs-all"
      title="Top-Rated (80+) vs All Players"
      subtitle="Top-rated players tend to be taller across most positions — except Wingers, where elite players are actually slightly shorter (-0.4 cm). The biggest gap is in Forward/Strikers (+2.4 cm)."
    >
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
        <ResponsiveContainer width="100%" height={400}>
          <BarChart data={chartData} barGap={4} barSize={30}>
            <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
            <XAxis
              dataKey="name"
              tick={{ fontSize: 11 }}
              interval={0}
              angle={-15}
              textAnchor="end"
              height={60}
            />
            <YAxis
              domain={[170, 192]}
              tickFormatter={(v: number) => `${v} cm`}
              tick={{ fontSize: 12 }}
            />
            <Tooltip
              formatter={(value: number, name: string, props: { payload?: { allCount?: number; topCount?: number; diff?: number } }) => {
                const label = name === "allPlayers" ? "All Players" : "Top Rated (80+)";
                const count = name === "allPlayers"
                  ? props?.payload?.allCount
                  : props?.payload?.topCount;
                return [`${value.toFixed(1)} cm (n=${count?.toLocaleString()})`, label];
              }}
            />
            <Legend
              formatter={(value: string) =>
                value === "allPlayers" ? "All Players" : "Top Rated (80+)"
              }
            />
            <Bar dataKey="allPlayers" fill="#3b82f6" radius={[4, 4, 0, 0]} />
            <Bar dataKey="topRated" fill="#1e3a5f" radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>

        <div className="mt-4 flex flex-wrap gap-3 justify-center text-xs text-gray-500">
          {chartData.map((d) => (
            <span
              key={d.name}
              className={`px-3 py-1 rounded-full ${
                d.diff > 0 ? "bg-blue-50 text-blue-700" : "bg-amber-50 text-amber-700"
              }`}
            >
              {d.name}: {d.diff > 0 ? "+" : ""}
              {d.diff.toFixed(1)} cm
            </span>
          ))}
        </div>
      </div>
    </SectionWrapper>
  );
}
