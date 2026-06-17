"use client";

import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  ReferenceLine,
  Dot,
} from "recharts";
import SectionWrapper from "../SectionWrapper";

interface RatingDecileData {
  decile: number;
  avg_height: number;
  count: number;
}

interface RatingHeightChartProps {
  data: RatingDecileData[];
  overallAvg: number;
}

const DECILE_LABELS: Record<number, string> = {
  1: "Bottom 10%",
  2: "10-20%",
  3: "20-30%",
  4: "30-40%",
  5: "40-50%",
  6: "50-60%",
  7: "60-70%",
  8: "70-80%",
  9: "80-90%",
  10: "Top 10%",
};

export default function RatingHeightChart({
  data,
  overallAvg,
}: RatingHeightChartProps) {
  const chartData = data.map((d) => ({
    name: DECILE_LABELS[d.decile] ?? `D${d.decile}`,
    decile: d.decile,
    avg: d.avg_height,
    count: d.count,
  }));

  return (
    <SectionWrapper
      id="rating-height"
      title="Height Across Rating Deciles"
      subtitle="A slight but consistent trend: higher-rated players tend to be marginally taller. The difference between the bottom and top decile is just 1.2 cm (180.2 vs 181.4), suggesting height is a minor factor in overall rating."
    >
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
        <ResponsiveContainer width="100%" height={380}>
          <LineChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
            <XAxis
              dataKey="name"
              tick={{ fontSize: 10 }}
              interval={0}
              angle={-30}
              textAnchor="end"
              height={70}
            />
            <YAxis
              domain={[179.5, 182]}
              tickFormatter={(v: number) => `${v} cm`}
              tick={{ fontSize: 12 }}
            />
            <Tooltip
              formatter={(value: number, _name: string, props: { payload?: { count?: number } }) => [
                `${value.toFixed(1)} cm (n=${props?.payload?.count?.toLocaleString()})`,
                "Avg Height",
              ]}
            />
            <ReferenceLine
              y={overallAvg}
              stroke="#9CA3AF"
              strokeDasharray="6 4"
              label={{
                value: `Overall avg: ${overallAvg} cm`,
                position: "right",
                fontSize: 11,
                fill: "#9CA3AF",
              }}
            />
            <Line
              type="monotone"
              dataKey="avg"
              stroke="#1e3a5f"
              strokeWidth={2.5}
              dot={<Dot r={5} fill="#1e3a5f" stroke="#fff" strokeWidth={2} />}
              activeDot={{ r: 7, fill: "#3b82f6" }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </SectionWrapper>
  );
}
