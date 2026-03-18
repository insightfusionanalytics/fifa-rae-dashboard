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
  ReferenceLine,
} from "recharts";
import SectionWrapper from "../SectionWrapper";

interface CountryPositionData {
  country: string;
  total_players: number;
  country_avg_height: number;
  winger: { avg_height: number; count: number };
  central_midfielder: { avg_height: number; count: number };
  centre_back: { avg_height: number; count: number };
}

interface CountryComparisonChartProps {
  data: CountryPositionData[];
  overallAvg: number;
}

export default function CountryComparisonChart({
  data,
  overallAvg,
}: CountryComparisonChartProps) {
  const chartData = data.map((d) => ({
    name: d.country,
    countryAvg: d.country_avg_height,
    winger: d.winger.avg_height,
    centreMid: d.central_midfielder.avg_height,
    centreBack: d.centre_back.avg_height,
    wingerCount: d.winger.count,
    cmCount: d.central_midfielder.count,
    cbCount: d.centre_back.count,
    totalPlayers: d.total_players,
  }));

  return (
    <SectionWrapper
      id="country-comparison"
      title="Height by Country & Position"
      subtitle="For the top 5 countries by player count: how do Wingers, Central Midfielders, and Centre Backs compare to the country average? Germany stands out with the tallest players across all three positions."
    >
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
        <ResponsiveContainer width="100%" height={420}>
          <BarChart data={chartData} barGap={2} barSize={22}>
            <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
            <XAxis dataKey="name" tick={{ fontSize: 12 }} />
            <YAxis
              domain={[172, 192]}
              tickFormatter={(v: number) => `${v} cm`}
              tick={{ fontSize: 12 }}
            />
            <Tooltip
              formatter={(value: number, name: string) => {
                const labels: Record<string, string> = {
                  winger: "Winger",
                  centreMid: "Central Midfielder",
                  centreBack: "Centre Back",
                  countryAvg: "Country Average",
                };
                return [`${value.toFixed(1)} cm`, labels[name] ?? name];
              }}
            />
            <Legend
              formatter={(value: string) => {
                const labels: Record<string, string> = {
                  winger: "Winger",
                  centreMid: "Central Midfielder",
                  centreBack: "Centre Back",
                  countryAvg: "Country Avg",
                };
                return labels[value] ?? value;
              }}
            />
            <ReferenceLine
              y={overallAvg}
              stroke="#9CA3AF"
              strokeDasharray="6 4"
              label={{
                value: `Global avg: ${overallAvg} cm`,
                position: "right",
                fontSize: 11,
                fill: "#9CA3AF",
              }}
            />
            <Bar dataKey="winger" fill="#f59e0b" radius={[3, 3, 0, 0]} />
            <Bar dataKey="centreMid" fill="#3b82f6" radius={[3, 3, 0, 0]} />
            <Bar dataKey="centreBack" fill="#1e3a5f" radius={[3, 3, 0, 0]} />
            <Bar dataKey="countryAvg" fill="#9CA3AF" radius={[3, 3, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>

        <div className="mt-4 bg-blue-50 border border-blue-100 rounded-lg p-4 text-sm text-blue-800">
          <strong>Taryn&apos;s insight:</strong> Within every country, the positional
          height hierarchy holds — Centre Backs are tallest, Wingers shortest.
          But German Wingers (178.9 cm) are taller than Argentine Centre Backs
          would be as Wingers, highlighting how national body-type pools shape
          recruitment differently.
        </div>
      </div>
    </SectionWrapper>
  );
}
