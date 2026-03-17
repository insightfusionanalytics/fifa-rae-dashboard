"use client";

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  ReferenceLine,
} from "recharts";
import SectionWrapper from "./SectionWrapper";
import { QUARTER_COLORS } from "@/lib/constants";
import type { PositionGroup } from "@/lib/types";

interface PositionChartProps {
  data: PositionGroup[];
}

export default function PositionChart({ data }: PositionChartProps) {
  const chartData = data.map((pos) => ({
    name: pos.group,
    Q1: pos.quarters[0],
    Q2: pos.quarters[1],
    Q3: pos.quarters[2],
    Q4: pos.quarters[3],
    n: pos.n,
  }));

  return (
    <SectionWrapper
      id="position"
      title="RAE by Position"
      subtitle="Defenders show the strongest RAE (34.9% Q1), while forwards show the weakest (32.8% Q1) — likely because technical skill can offset physical maturity advantages."
    >
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
        <ResponsiveContainer width="100%" height={380}>
          <BarChart data={chartData} barGap={2} barCategoryGap="20%">
            <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
            <XAxis dataKey="name" tick={{ fontSize: 13 }} />
            <YAxis
              domain={[0, 40]}
              tickFormatter={(v: number) => `${v}%`}
              tick={{ fontSize: 12 }}
            />
            <Tooltip
              formatter={(value: number, name: string) => [
                `${value}%`,
                name,
              ]}
            />
            <Legend
              wrapperStyle={{ fontSize: 12 }}
            />
            <ReferenceLine
              y={25}
              stroke="#9CA3AF"
              strokeDasharray="6 4"
            />
            <Bar dataKey="Q1" fill={QUARTER_COLORS.Q1} radius={[4, 4, 0, 0]} />
            <Bar dataKey="Q2" fill={QUARTER_COLORS.Q2} radius={[4, 4, 0, 0]} />
            <Bar dataKey="Q3" fill={QUARTER_COLORS.Q3} radius={[4, 4, 0, 0]} />
            <Bar dataKey="Q4" fill={QUARTER_COLORS.Q4} radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>

        {/* Position stats table */}
        <div className="mt-6 overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-200 text-left text-gray-500">
                <th className="pb-2 font-medium">Position</th>
                <th className="pb-2 font-medium text-right">Players</th>
                <th className="pb-2 font-medium text-right">Chi-squared</th>
                <th className="pb-2 font-medium text-right">Cramer&apos;s V</th>
              </tr>
            </thead>
            <tbody>
              {data.map((pos) => (
                <tr key={pos.group} className="border-b border-gray-50">
                  <td className="py-2 font-medium text-gray-800">
                    {pos.group}
                  </td>
                  <td className="py-2 text-right text-gray-600">
                    {pos.n.toLocaleString()}
                  </td>
                  <td className="py-2 text-right text-gray-600">
                    {pos.stats.chi2.toFixed(1)}
                  </td>
                  <td className="py-2 text-right text-gray-600">
                    {pos.stats.v.toFixed(4)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </SectionWrapper>
  );
}
