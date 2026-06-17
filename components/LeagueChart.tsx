"use client";

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ReferenceLine,
  ResponsiveContainer,
  Cell,
} from "recharts";
import SectionWrapper from "./SectionWrapper";
import { QUARTER_COLORS, COLORS } from "@/lib/constants";
import type { LeagueData } from "@/lib/types";

interface LeagueChartProps {
  data: LeagueData[];
}

export default function LeagueChart({ data }: LeagueChartProps) {
  const sorted = [...data].sort((a, b) => b.quarters[0] - a.quarters[0]);

  const chartData = sorted.map((d) => ({
    name: d.league,
    q1: d.quarters[0],
    n: d.n,
    v: d.stats.v,
  }));

  return (
    <SectionWrapper
      id="league"
      title="RAE by League (Tier 1)"
      subtitle="Serie A leads with a staggering 50.4% Q1 share — half of all players born in the first quarter."
    >
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
        <ResponsiveContainer width="100%" height={400}>
          <BarChart data={chartData} layout="vertical" barSize={24}>
            <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
            <XAxis
              type="number"
              domain={[0, 55]}
              tickFormatter={(v: number) => `${v}%`}
              tick={{ fontSize: 12 }}
            />
            <YAxis
              type="category"
              dataKey="name"
              width={120}
              tick={{ fontSize: 12 }}
            />
            <Tooltip
              formatter={(value: any, _name: any, props: any) => [
                `${value}% (${props?.payload?.n?.toLocaleString()} players, V=${props?.payload?.v?.toFixed(3)})`,
                "Q1 Share",
              ]}
            />
            <ReferenceLine
              x={25}
              stroke="#9CA3AF"
              strokeDasharray="6 4"
              label={{
                value: "Expected 25%",
                position: "top",
                fontSize: 11,
                fill: "#9CA3AF",
              }}
            />
            <Bar dataKey="q1" radius={[0, 6, 6, 0]}>
              {chartData.map((entry, index) => (
                <Cell
                  key={`cell-${index}`}
                  fill={
                    entry.q1 > 40
                      ? COLORS.accent
                      : entry.q1 > 33
                      ? QUARTER_COLORS.Q1
                      : COLORS.primary
                  }
                />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
    </SectionWrapper>
  );
}
