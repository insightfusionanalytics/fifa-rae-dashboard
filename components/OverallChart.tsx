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
import { QUARTER_COLORS } from "@/lib/constants";
import type { QuarterData, MonthData } from "@/lib/types";

interface OverallChartProps {
  quarters: QuarterData;
  months: MonthData;
}

const MONTH_NAMES = [
  "Jan", "Feb", "Mar", "Apr", "May", "Jun",
  "Jul", "Aug", "Sep", "Oct", "Nov", "Dec",
];

export default function OverallChart({ quarters, months }: OverallChartProps) {
  const hasData = quarters.values.length > 0 && quarters.values.some((v) => v > 0);

  const quarterData = quarters.labels.map((label, i) => ({
    name: label,
    value: quarters.values[i] ?? 0,
    count: quarters.counts[i] ?? 0,
  }));

  const monthData = months.labels.map((_, i) => ({
    name: MONTH_NAMES[i] ?? `M${i + 1}`,
    value: months.values[i] ?? 0,
  }));

  const qColors = [
    QUARTER_COLORS.Q1,
    QUARTER_COLORS.Q2,
    QUARTER_COLORS.Q3,
    QUARTER_COLORS.Q4,
  ];

  const q1Val = quarters.values[0] ?? 0;
  const q4Val = quarters.values[3] ?? 0;

  const subtitle = hasData
    ? `If birth month had no effect, each quarter would have 25%. Instead, Q1 has ${q1Val}% and Q4 just ${q4Val}%.`
    : "No data available for the selected filters.";

  return (
    <SectionWrapper
      id="overall"
      title="Overall Birth Quarter Distribution"
      subtitle={subtitle}
    >
      <div className="grid lg:grid-cols-2 gap-8">
        {/* Quarter bar chart */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <h3 className="text-sm font-semibold text-gray-700 mb-4">
            By Quarter
          </h3>
          {hasData ? (
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={quarterData} barSize={60}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis dataKey="name" tick={{ fontSize: 13 }} />
                <YAxis
                  domain={[0, 40]}
                  tickFormatter={(v: number) => `${v}%`}
                  tick={{ fontSize: 12 }}
                />
                <Tooltip
                  formatter={(value: number, _name: string, props: { payload?: { count?: number } }) => [
                    `${value}% (${props?.payload?.count?.toLocaleString() ?? 0} players)`,
                    "Share",
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
                <Bar dataKey="value" radius={[6, 6, 0, 0]}>
                  {quarterData.map((_, index) => (
                    <Cell key={`cell-${index}`} fill={qColors[index]} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          ) : (
            <div className="h-[300px] flex items-center justify-center text-gray-400 text-sm">
              No data for selected filters
            </div>
          )}
        </div>

        {/* Monthly bar chart */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <h3 className="text-sm font-semibold text-gray-700 mb-4">
            By Month
          </h3>
          {hasData ? (
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={monthData} barSize={28}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis dataKey="name" tick={{ fontSize: 11 }} />
                <YAxis
                  domain={[0, 14]}
                  tickFormatter={(v: number) => `${v}%`}
                  tick={{ fontSize: 12 }}
                />
                <Tooltip
                  formatter={(value: number) => [`${value}%`, "Share"]}
                />
                <ReferenceLine
                  y={8.33}
                  stroke="#9CA3AF"
                  strokeDasharray="6 4"
                  label={{
                    value: "Expected 8.3%",
                    position: "right",
                    fontSize: 11,
                    fill: "#9CA3AF",
                  }}
                />
                <Bar dataKey="value" radius={[4, 4, 0, 0]} fill="#1E3A5F" />
              </BarChart>
            </ResponsiveContainer>
          ) : (
            <div className="h-[300px] flex items-center justify-center text-gray-400 text-sm">
              No data for selected filters
            </div>
          )}
        </div>
      </div>

      {/* Stats badge */}
      {hasData && (
        <div className="mt-4 flex flex-wrap gap-3 justify-center text-xs text-gray-500">
          <span className="bg-gray-100 px-3 py-1 rounded-full">
            Chi-squared = {quarters.stats.chi2.toFixed(1)}
          </span>
          <span className="bg-gray-100 px-3 py-1 rounded-full">
            p {quarters.stats.p < 0.001 ? "< 0.001" : `= ${quarters.stats.p.toFixed(4)}`}
          </span>
          <span className="bg-gray-100 px-3 py-1 rounded-full">
            Cramer&apos;s V = {quarters.stats.v.toFixed(4)}
          </span>
          <span className="bg-gray-100 px-3 py-1 rounded-full">
            n = {quarters.stats.n.toLocaleString()}
          </span>
        </div>
      )}
    </SectionWrapper>
  );
}
