"use client";

import SectionWrapper from "./SectionWrapper";
import type { Overview, TierData } from "@/lib/types";

interface MethodologyProps {
  overview: Overview;
  tiers: TierData[];
}

export default function Methodology({ overview, tiers }: MethodologyProps) {
  return (
    <SectionWrapper
      id="methodology"
      title="Methodology"
      subtitle="How this analysis was conducted"
    >
      <div className="grid lg:grid-cols-2 gap-8">
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <h3 className="text-sm font-semibold text-gray-700 mb-3">
            Data Source
          </h3>
          <ul className="space-y-2 text-sm text-gray-600">
            <li>
              <strong>{overview.totalPlayers.toLocaleString()}</strong> unique
              player-season records from FIFA{" "}
              {overview.fifaVersions[0]}&ndash;
              {overview.fifaVersions[overview.fifaVersions.length - 1]}
            </li>
            <li>
              <strong>{overview.nationalities}</strong> nationalities across{" "}
              <strong>{overview.leagues}</strong> leagues
            </li>
            <li>
              Average age: {overview.avgAge} | Average rating:{" "}
              {overview.avgRating} | Average height: {overview.avgHeight} cm
            </li>
            <li>
              Tier 1 leagues:{" "}
              {tiers[0]?.n.toLocaleString() || "N/A"} players |
              Other leagues:{" "}
              {tiers[1]?.n.toLocaleString() || "N/A"} players
            </li>
          </ul>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <h3 className="text-sm font-semibold text-gray-700 mb-3">
            Statistical Methods
          </h3>
          <ul className="space-y-2 text-sm text-gray-600">
            <li>
              <strong>Chi-squared goodness-of-fit test</strong> against uniform
              distribution (25% per quarter)
            </li>
            <li>
              <strong>Cramer&apos;s V</strong> as effect size measure (0 = no
              association, 1 = perfect association)
            </li>
            <li>
              <strong>Significance threshold:</strong> p &lt; 0.05 with
              Bonferroni correction where applicable
            </li>
            <li>
              <strong>Football year adjustment:</strong> Q1 is defined relative to
              each country&apos;s football year start (Jan, Apr, Aug, or Sep)
            </li>
          </ul>
        </div>

        <div className="lg:col-span-2 bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <h3 className="text-sm font-semibold text-gray-700 mb-3">
            What is the Relative Age Effect?
          </h3>
          <p className="text-sm text-gray-600 leading-relaxed">
            The Relative Age Effect (RAE) is a well-documented phenomenon where
            athletes born earlier in the selection year are overrepresented in
            professional sports. In youth development, children born in Q1
            (January-March for most countries) are up to 11 months older than
            Q4-born peers in the same age group. This maturity advantage leads to
            better performance evaluations, more playing time, and higher
            selection rates — creating a self-reinforcing cycle that persists
            into professional careers. Our analysis confirms this effect across
            56,880 FIFA-rated players: Q1 holds 33.8% of all players (expected:
            25%), while Q4 holds just 17.6%.
          </p>
        </div>
      </div>

      {/* Footer */}
      <div className="mt-16 text-center text-xs text-gray-400 pb-8">
        <p>
          FIFA Player Analysis &mdash; Insight Fusion Analytics &mdash;{" "}
          {new Date().getFullYear()}
        </p>
        <p className="mt-1">
          Data sourced from EA Sports FIFA series. For research purposes only.
        </p>
      </div>
    </SectionWrapper>
  );
}
