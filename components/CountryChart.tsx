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
import { COLORS } from "@/lib/constants";
import type { CountryData } from "@/lib/types";

interface CountryChartProps {
  data: CountryData[];
}

export default function CountryChart({ data }: CountryChartProps) {
  const sorted = [...data].sort((a, b) => b.q1Excess - a.q1Excess);

  const chartData = sorted.map((d) => ({
    name: d.country,
    excess: d.q1Excess,
    q1Pct: d.q1Pct,
    n: d.n,
    significant: d.significant,
    fyType: d.fyType,
  }));

  return (
    <SectionWrapper
      id="country"
      title="RAE by Country"
      subtitle="Q1 excess shows how many percentage points above the expected 25% each country's Q1 share sits. Colored by statistical significance."
    >
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
        <div className="flex gap-4 mb-4 text-xs">
          <span className="flex items-center gap-1.5">
            <span
              className="w-3 h-3 rounded-sm inline-block"
              style={{ backgroundColor: COLORS.significant }}
            />
            Significant (p &lt; 0.05)
          </span>
          <span className="flex items-center gap-1.5">
            <span
              className="w-3 h-3 rounded-sm inline-block"
              style={{ backgroundColor: COLORS.notSignificant }}
            />
            Not significant
          </span>
        </div>

        <ResponsiveContainer width="100%" height={560}>
          <BarChart data={chartData} layout="vertical" barSize={20}>
            <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
            <XAxis
              type="number"
              domain={[-2, 22]}
              tickFormatter={(v: number) => `${v > 0 ? "+" : ""}${v}pp`}
              tick={{ fontSize: 12 }}
              label={{
                value: "Q1 Excess (pp above expected 25%)",
                position: "insideBottom",
                offset: -5,
                fontSize: 11,
                fill: COLORS.neutral,
              }}
            />
            <YAxis
              type="category"
              dataKey="name"
              width={140}
              tick={{ fontSize: 11 }}
            />
            <Tooltip
              formatter={(value: any, _name: any, props: any) => [
                `${Number(value) > 0 ? "+" : ""}${value}pp (Q1=${props?.payload?.q1Pct}%, n=${props?.payload?.n?.toLocaleString()}, FY=${props?.payload?.fyType})`,
                "Q1 Excess",
              ]}
            />
            <ReferenceLine x={0} stroke="#374151" strokeWidth={1} />
            <Bar dataKey="excess" radius={[0, 4, 4, 0]}>
              {chartData.map((entry, index) => (
                <Cell
                  key={`cell-${index}`}
                  fill={
                    entry.significant
                      ? COLORS.significant
                      : COLORS.notSignificant
                  }
                />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>

        <div className="mt-4 bg-amber-50 border border-amber-100 rounded-lg p-4 text-sm text-amber-800">
          <strong>Note:</strong> &ldquo;FY type&rdquo; indicates the football year
          start month used for Q1 classification (e.g., jan = January-December,
          sept = September-August for England, apr = April-March for Japan).
        </div>
      </div>
    </SectionWrapper>
  );
}
