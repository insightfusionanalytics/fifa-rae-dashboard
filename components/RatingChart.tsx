"use client";

import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ReferenceLine,
  ResponsiveContainer,
} from "recharts";
import SectionWrapper from "./SectionWrapper";
import { QUARTER_COLORS, COLORS } from "@/lib/constants";
import type { DecileData } from "@/lib/types";

interface RatingChartProps {
  data: DecileData[];
}

export default function RatingChart({ data }: RatingChartProps) {
  const chartData = data.map((d) => ({
    name: `D${d.decile}`,
    label: d.decile === 1 ? "Lowest" : d.decile === 10 ? "Highest" : `D${d.decile}`,
    q1Pct: d.q1Pct,
    n: d.n,
  }));

  return (
    <SectionWrapper
      id="rating"
      title="RAE by Player Rating"
      subtitle="Q1 share remains elevated (32-35%) across ALL rating deciles — RAE persists even among elite-rated players."
    >
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
        <ResponsiveContainer width="100%" height={350}>
          <LineChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
            <XAxis
              dataKey="name"
              tick={{ fontSize: 12 }}
              label={{
                value: "Rating Decile (1 = Lowest, 10 = Highest)",
                position: "insideBottom",
                offset: -5,
                fontSize: 11,
                fill: COLORS.neutral,
              }}
            />
            <YAxis
              domain={[20, 40]}
              tickFormatter={(v: number) => `${v}%`}
              tick={{ fontSize: 12 }}
            />
            <Tooltip
              formatter={(value: any, _name: any, props: any) => [
                `${value}% (${props?.payload?.n?.toLocaleString()} players)`,
                "Q1 Share",
              ]}
            />
            <ReferenceLine
              y={25}
              stroke="#9CA3AF"
              strokeDasharray="6 4"
              label={{
                value: "Expected 25%",
                position: "right",
                fontSize: 11,
                fill: "#9CA3AF",
              }}
            />
            <Line
              type="monotone"
              dataKey="q1Pct"
              stroke={QUARTER_COLORS.Q1}
              strokeWidth={3}
              dot={{ r: 5, fill: QUARTER_COLORS.Q1, strokeWidth: 2, stroke: "#fff" }}
              activeDot={{ r: 7 }}
            />
          </LineChart>
        </ResponsiveContainer>

        <div className="mt-4 bg-blue-50 border border-blue-100 rounded-lg p-4 text-sm text-blue-800">
          <strong>Key finding:</strong> The RAE does not diminish at higher skill
          levels. Even the top-rated players (Decile 9-10) show Q1 shares of
          ~34-35%, suggesting that early selection advantages persist throughout
          a player&apos;s career.
        </div>
      </div>
    </SectionWrapper>
  );
}
