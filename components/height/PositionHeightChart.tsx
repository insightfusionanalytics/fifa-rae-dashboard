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
  ErrorBar,
} from "recharts";
import SectionWrapper from "../SectionWrapper";

interface SubPositionData {
  position: string;
  avg_height: number;
  median_height: number;
  std_dev: number;
  count: number;
  min: number;
  max: number;
}

interface PositionHeightChartProps {
  data: SubPositionData[];
}

const POSITION_COLORS: Record<string, string> = {
  Goalkeeper: "#1e3a5f",
  "Centre Back": "#2a4a6f",
  Fullback: "#3b82f6",
  "Central Midfielder": "#6366f1",
  Winger: "#f59e0b",
  "Forward/Striker": "#ef4444",
};

export default function PositionHeightChart({ data }: PositionHeightChartProps) {
  const chartData = data.map((d) => ({
    name: d.position,
    avg: d.avg_height,
    median: d.median_height,
    stdDev: d.std_dev,
    count: d.count,
    min: d.min,
    max: d.max,
  }));

  return (
    <SectionWrapper
      id="position-height"
      title="Average Height by Position"
      subtitle="Goalkeepers are the tallest on average at 187.5 cm, while Wingers are the shortest at 176.4 cm — an 11 cm gap that reflects the physical demands of each role."
    >
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
        <ResponsiveContainer width="100%" height={400}>
          <BarChart data={chartData} barSize={50}>
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
              formatter={(value: number, _name: string, props: { payload?: { count?: number; median?: number; min?: number; max?: number; stdDev?: number } }) => [
                `${value.toFixed(1)} cm (median: ${props?.payload?.median}cm, range: ${props?.payload?.min}–${props?.payload?.max}cm, n=${props?.payload?.count?.toLocaleString()})`,
                "Avg Height",
              ]}
            />
            <Bar dataKey="avg" radius={[6, 6, 0, 0]}>
              {chartData.map((entry, index) => (
                <Cell
                  key={`cell-${index}`}
                  fill={POSITION_COLORS[entry.name] ?? "#1e3a5f"}
                />
              ))}
              <ErrorBar dataKey="stdDev" width={4} strokeWidth={1.5} stroke="#374151" />
            </Bar>
          </BarChart>
        </ResponsiveContainer>

        <div className="mt-4 flex flex-wrap gap-3 justify-center text-xs text-gray-500">
          {chartData.map((d) => (
            <span key={d.name} className="bg-gray-100 px-3 py-1 rounded-full">
              {d.name}: {d.count.toLocaleString()} players
            </span>
          ))}
        </div>
      </div>
    </SectionWrapper>
  );
}
