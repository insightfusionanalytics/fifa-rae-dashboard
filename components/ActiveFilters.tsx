"use client";

import type { FilterState } from "@/lib/types";
import { FILTER_LABELS } from "@/lib/constants";

interface ActiveFiltersProps {
  filters: FilterState;
  totalFiltered: number;
  totalAll: number;
  onRemove: (key: keyof FilterState, value: string | number | boolean) => void;
  onClearAll: () => void;
}

export default function ActiveFilters({
  filters,
  totalFiltered,
  totalAll,
  onRemove,
  onClearAll,
}: ActiveFiltersProps) {
  const pills: { key: keyof FilterState; label: string; value: string | number | boolean }[] = [];

  const arrayKeys = [
    "nationality_name",
    "position_group",
    "league_name",
    "rating_tier",
    "football_year_type",
  ] as const;

  for (const key of arrayKeys) {
    for (const val of filters[key]) {
      pills.push({
        key,
        label: `${FILTER_LABELS[key]}: ${val}`,
        value: val,
      });
    }
  }

  for (const v of filters.fifa_version) {
    pills.push({
      key: "fifa_version",
      label: `FIFA ${v}`,
      value: v,
    });
  }

  if (filters.is_starter === true) {
    pills.push({
      key: "is_starter",
      label: "Starters Only",
      value: true,
    });
  }

  if (pills.length === 0) return null;

  return (
    <div className="bg-gray-100 border-b border-gray-200">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-2.5">
        <div className="flex items-center gap-2 flex-wrap">
          <span className="text-sm text-gray-600 font-medium">
            Showing{" "}
            <span className="font-semibold text-navy">
              {totalFiltered.toLocaleString()}
            </span>{" "}
            of {totalAll.toLocaleString()} players
          </span>

          <div className="flex items-center gap-1.5 flex-wrap ml-2">
            {pills.map((pill, i) => (
              <span
                key={`${pill.key}-${pill.value}-${i}`}
                className="inline-flex items-center gap-1 bg-white border border-gray-200 rounded-full px-2.5 py-0.5 text-xs font-medium text-gray-700 shadow-sm"
              >
                {pill.label}
                <button
                  onClick={() => onRemove(pill.key, pill.value)}
                  className="text-gray-400 hover:text-red-500 transition-colors ml-0.5"
                  aria-label={`Remove ${pill.label}`}
                >
                  &times;
                </button>
              </span>
            ))}
          </div>

          <button
            onClick={onClearAll}
            className="ml-auto text-xs text-red-500 hover:text-red-700 font-medium transition-colors"
          >
            Clear All
          </button>
        </div>
      </div>
    </div>
  );
}
