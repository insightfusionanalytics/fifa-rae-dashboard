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
  ReferenceLine,
} from "recharts";
import SectionWrapper from "../SectionWrapper";

interface FootByPosition {
  [position: string]: {
    left_pct: number;
    right_pct: number;
    left_count: number;
    right_count: number;
  };
}

interface FootAnalysisData {
  overall: {
    left_foot_pct: number;
    right_foot_pct: number;
    left_foot_count: number;
    right_foot_count: number;
  };
  population_baseline: {
    left_hand_pct: number;
    right_hand_pct: number;
  };
  ratio: number;
  byPosition: FootByPosition;
}

interface FootAnalysisChartProps {
  data: FootAnalysisData;
}

const COLORS = {
  navy: "#1e3a5f",
  blue: "#3b82f6",
  amber: "#f59e0b",
  green: "#10b981",
  red: "#ef4444",
  gray: "#9CA3AF",
};

export default function FootAnalysisChart({ data }: FootAnalysisChartProps) {
  // Comparison bar data
  const comparisonData = [
    {
      name: "Left-footed\n(Football)",
      value: data.overall.left_foot_pct,
      fill: COLORS.navy,
    },
    {
      name: "Left-handed\n(Gen. Pop.)",
      value: data.population_baseline.left_hand_pct,
      fill: COLORS.gray,
    },
  ];

  // By-position data sorted by left_pct descending
  const positionData = Object.entries(data.byPosition)
    .map(([position, stats]) => ({
      name: position,
      left_pct: stats.left_pct,
      right_pct: stats.right_pct,
      left_count: stats.left_count,
      total: stats.left_count + stats.right_count,
    }))
    .sort((a, b) => b.left_pct - a.left_pct);

  const positionColors = [
    COLORS.red,
    COLORS.amber,
    COLORS.navy,
    COLORS.blue,
    COLORS.green,
    COLORS.gray,
  ];

  return (
    <SectionWrapper
      id="foot-analysis"
      title="Left-Foot vs Left-Hand: The 2x Gap"
      subtitle={`${data.overall.left_foot_pct}% of FIFA players are left-footed — ${data.ratio}x the rate of left-handedness (${data.population_baseline.left_hand_pct}%) in the general population. Fullbacks show the highest left-foot rate at ${data.byPosition["Fullback"]?.left_pct ?? 0}%.`}
    >
      <div className="grid lg:grid-cols-2 gap-8">
        {/* Main comparison */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <h3 className="text-sm font-semibold text-gray-700 mb-1">
            Football vs General Population
          </h3>
          <p className="text-xs text-gray-400 mb-4">
            Left-side dominance comparison
          </p>

          {/* Big ratio callout */}
          <div className="bg-navy/5 rounded-xl p-5 mb-6 text-center">
            <div className="text-5xl font-black text-navy">{data.ratio}x</div>
            <div className="text-sm text-gray-500 mt-1">
              more left-footed players than expected from handedness alone
            </div>
            <div className="flex justify-center gap-6 mt-4 text-xs">
              <div>
                <span className="inline-block w-2.5 h-2.5 rounded-sm mr-1.5" style={{ backgroundColor: COLORS.navy }} />
                Left-footed: <strong>{data.overall.left_foot_pct}%</strong>
              </div>
              <div>
                <span className="inline-block w-2.5 h-2.5 rounded-sm mr-1.5" style={{ backgroundColor: COLORS.gray }} />
                Left-handed: <strong>{data.population_baseline.left_hand_pct}%</strong>
              </div>
            </div>
          </div>

          <ResponsiveContainer width="100%" height={180}>
            <BarChart data={comparisonData} barSize={60} layout="vertical">
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis
                type="number"
                domain={[0, 30]}
                tickFormatter={(v: number) => `${v}%`}
                tick={{ fontSize: 12 }}
              />
              <YAxis
                type="category"
                dataKey="name"
                width={110}
                tick={{ fontSize: 11 }}
              />
              <Tooltip
                formatter={(value: number) => [`${value}%`, "Rate"]}
              />
              <Bar dataKey="value" radius={[0, 6, 6, 0]}>
                {comparisonData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.fill} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* By position */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <h3 className="text-sm font-semibold text-gray-700 mb-1">
            Left-Foot % by Position
          </h3>
          <p className="text-xs text-gray-400 mb-4">
            Fullbacks lead — tactical need for a &ldquo;natural&rdquo; side foot
          </p>

          <ResponsiveContainer width="100%" height={320}>
            <BarChart data={positionData} layout="vertical" barSize={24}>
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
                width={130}
                tick={{ fontSize: 11 }}
              />
              <Tooltip
                formatter={(value: number, _name: string, props: { payload?: { left_count?: number; total?: number } }) => [
                  `${value}% (${props?.payload?.left_count?.toLocaleString() ?? 0} of ${props?.payload?.total?.toLocaleString() ?? 0})`,
                  "Left-footed",
                ]}
              />
              <ReferenceLine
                x={data.overall.left_foot_pct}
                stroke={COLORS.navy}
                strokeDasharray="6 4"
                label={{
                  value: `Avg ${data.overall.left_foot_pct}%`,
                  position: "top",
                  fontSize: 10,
                  fill: COLORS.navy,
                }}
              />
              <Bar dataKey="left_pct" radius={[0, 6, 6, 0]}>
                {positionData.map((_, index) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={positionColors[index % positionColors.length]}
                  />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Insight badge */}
      <div className="mt-4 flex flex-wrap gap-3 justify-center text-xs text-gray-500">
        <span className="bg-gray-100 px-3 py-1 rounded-full">
          Left-footed: {data.overall.left_foot_count.toLocaleString()} players
        </span>
        <span className="bg-gray-100 px-3 py-1 rounded-full">
          Right-footed: {data.overall.right_foot_count.toLocaleString()} players
        </span>
        <span className="bg-gray-100 px-3 py-1 rounded-full">
          Fullback left %: {data.byPosition["Fullback"]?.left_pct ?? 0}% (highest)
        </span>
        <span className="bg-gray-100 px-3 py-1 rounded-full">
          Goalkeeper left %: {data.byPosition["Goalkeeper"]?.left_pct ?? 0}% (lowest)
        </span>
      </div>
    </SectionWrapper>
  );
}
