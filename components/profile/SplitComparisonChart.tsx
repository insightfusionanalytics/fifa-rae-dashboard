"use client";

import SectionWrapper from "../SectionWrapper";

interface SplitGroup {
  count: number;
  avg_overall: number;
  avg_height: number;
  left_foot_pct: number;
  top_country: string;
  top_country_pct: number;
  top_position: string;
  top_3_countries: { country: string; count: number; pct: number }[];
  top_3_positions: { position: string; count: number; pct: number }[];
  foot_distribution: { Right: number; Left: number };
  median_birth_month: number;
}

interface SplitsData {
  byRating: {
    top: SplitGroup | null;
    bottom: SplitGroup | null;
    top_threshold: number;
    bottom_threshold: number;
  };
  byLeague: {
    big5: SplitGroup | null;
    rest: SplitGroup | null;
  };
}

interface SplitComparisonChartProps {
  data: SplitsData;
}

function ComparisonRow({
  label,
  leftValue,
  rightValue,
  highlight,
}: {
  label: string;
  leftValue: string;
  rightValue: string;
  highlight?: boolean;
}) {
  return (
    <div className={`grid grid-cols-3 text-center py-2.5 ${highlight ? "bg-blue-50/50" : ""}`}>
      <div className="text-sm font-semibold text-navy">{leftValue}</div>
      <div className="text-xs text-gray-400 self-center">{label}</div>
      <div className="text-sm font-semibold text-gray-600">{rightValue}</div>
    </div>
  );
}

function SplitPanel({
  title,
  subtitle,
  leftLabel,
  rightLabel,
  leftGroup,
  rightGroup,
  leftAccent,
}: {
  title: string;
  subtitle: string;
  leftLabel: string;
  rightLabel: string;
  leftGroup: SplitGroup | null;
  rightGroup: SplitGroup | null;
  leftAccent: string;
}) {
  if (!leftGroup || !rightGroup) {
    return (
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
        <h3 className="text-sm font-semibold text-gray-700 mb-1">{title}</h3>
        <p className="text-xs text-gray-400 mb-5">{subtitle}</p>
        <div className="bg-gray-50 rounded-lg p-6 text-center text-sm text-gray-500">
          Not enough players in the current filter selection to show this comparison.
        </div>
      </div>
    );
  }
  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
      <h3 className="text-sm font-semibold text-gray-700 mb-1">{title}</h3>
      <p className="text-xs text-gray-400 mb-5">{subtitle}</p>

      {/* Column headers */}
      <div className="grid grid-cols-3 text-center mb-1">
        <div>
          <div
            className="inline-block text-xs font-bold text-white px-3 py-1 rounded-full"
            style={{ backgroundColor: leftAccent }}
          >
            {leftLabel}
          </div>
          <div className="text-[10px] text-gray-400 mt-1">
            {leftGroup.count.toLocaleString()} players
          </div>
        </div>
        <div className="self-center text-xs text-gray-300">vs</div>
        <div>
          <div className="inline-block text-xs font-bold text-gray-600 bg-gray-100 px-3 py-1 rounded-full">
            {rightLabel}
          </div>
          <div className="text-[10px] text-gray-400 mt-1">
            {rightGroup.count.toLocaleString()} players
          </div>
        </div>
      </div>

      {/* Divider */}
      <div className="h-px bg-gray-100 my-3" />

      {/* Comparison rows */}
      <div className="divide-y divide-gray-50">
        <ComparisonRow
          label="Avg Rating"
          leftValue={leftGroup.avg_overall.toFixed(1)}
          rightValue={rightGroup.avg_overall.toFixed(1)}
          highlight
        />
        <ComparisonRow
          label="Avg Height"
          leftValue={`${leftGroup.avg_height.toFixed(1)} cm`}
          rightValue={`${rightGroup.avg_height.toFixed(1)} cm`}
        />
        <ComparisonRow
          label="Left-Foot %"
          leftValue={`${leftGroup.left_foot_pct}%`}
          rightValue={`${rightGroup.left_foot_pct}%`}
          highlight
        />
        <ComparisonRow
          label="Top Country"
          leftValue={`${leftGroup.top_country} (${leftGroup.top_country_pct}%)`}
          rightValue={`${rightGroup.top_country} (${rightGroup.top_country_pct}%)`}
        />
        <ComparisonRow
          label="Top Position"
          leftValue={leftGroup.top_position}
          rightValue={rightGroup.top_position}
          highlight
        />
      </div>

      {/* Divider */}
      <div className="h-px bg-gray-100 my-3" />

      {/* Top 3 countries */}
      <div className="grid grid-cols-2 gap-4 mt-3">
        <div>
          <div className="text-[10px] uppercase tracking-wide text-gray-400 mb-2">Top 3 Countries</div>
          {leftGroup.top_3_countries.map((c) => (
            <div key={c.country} className="flex justify-between text-xs py-0.5">
              <span className="text-gray-600">{c.country}</span>
              <span className="font-medium text-navy">{c.pct}%</span>
            </div>
          ))}
        </div>
        <div>
          <div className="text-[10px] uppercase tracking-wide text-gray-400 mb-2">Top 3 Countries</div>
          {rightGroup.top_3_countries.map((c) => (
            <div key={c.country} className="flex justify-between text-xs py-0.5">
              <span className="text-gray-600">{c.country}</span>
              <span className="font-medium text-gray-500">{c.pct}%</span>
            </div>
          ))}
        </div>
      </div>

      {/* Top 3 positions */}
      <div className="grid grid-cols-2 gap-4 mt-4">
        <div>
          <div className="text-[10px] uppercase tracking-wide text-gray-400 mb-2">Top 3 Positions</div>
          {leftGroup.top_3_positions.map((p) => (
            <div key={p.position} className="flex justify-between text-xs py-0.5">
              <span className="text-gray-600">{p.position}</span>
              <span className="font-medium text-navy">{p.pct}%</span>
            </div>
          ))}
        </div>
        <div>
          <div className="text-[10px] uppercase tracking-wide text-gray-400 mb-2">Top 3 Positions</div>
          {rightGroup.top_3_positions.map((p) => (
            <div key={p.position} className="flex justify-between text-xs py-0.5">
              <span className="text-gray-600">{p.position}</span>
              <span className="font-medium text-gray-500">{p.pct}%</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default function SplitComparisonChart({ data }: SplitComparisonChartProps) {
  return (
    <SectionWrapper
      id="split-comparison"
      title="Split Comparisons"
      subtitle={`Side-by-side profile differences: Top-rated (${data.byRating.top_threshold}+) vs Bottom-rated (<${data.byRating.bottom_threshold}), and Big 5 leagues vs the rest. Elite players are taller, more left-footed, and dominated by Spain/Brazil.`}
    >
      <div className="grid lg:grid-cols-2 gap-8">
        <SplitPanel
          title="By Rating"
          subtitle={`Players rated ${data.byRating.top_threshold}+ vs below ${data.byRating.bottom_threshold}`}
          leftLabel={`${data.byRating.top_threshold}+ Rated`}
          rightLabel={`<${data.byRating.bottom_threshold} Rated`}
          leftGroup={data.byRating.top}
          rightGroup={data.byRating.bottom}
          leftAccent="#10b981"
        />
        <SplitPanel
          title="By League Tier"
          subtitle="Big 5 European leagues vs all other leagues"
          leftLabel="Big 5"
          rightLabel="Rest"
          leftGroup={data.byLeague.big5}
          rightGroup={data.byLeague.rest}
          leftAccent="#3b82f6"
        />
      </div>

      {/* Key takeaway */}
      <div className="mt-4 flex flex-wrap gap-3 justify-center text-xs text-gray-500">
        {data.byRating.top && data.byRating.bottom && (
          <>
            <span className="bg-gray-100 px-3 py-1 rounded-full">
              Top-rated left-foot: {data.byRating.top.left_foot_pct}% vs bottom: {data.byRating.bottom.left_foot_pct}%
            </span>
            <span className="bg-gray-100 px-3 py-1 rounded-full">
              Height gap (rating): {(data.byRating.top.avg_height - data.byRating.bottom.avg_height).toFixed(1)} cm
            </span>
          </>
        )}
        {data.byLeague.big5 && data.byLeague.rest && (
          <span className="bg-gray-100 px-3 py-1 rounded-full">
            Height gap (league): {(data.byLeague.big5.avg_height - data.byLeague.rest.avg_height).toFixed(1)} cm
          </span>
        )}
      </div>
    </SectionWrapper>
  );
}
