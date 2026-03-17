"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import type { FilterState, FilterOptions } from "@/lib/types";
import { FILTER_LABELS } from "@/lib/constants";

interface FilterBarProps {
  filters: FilterState;
  filterOptions: FilterOptions;
  onFilterChange: (key: keyof FilterState, value: FilterState[keyof FilterState]) => void;
  onClearAll: () => void;
  hasActiveFilters: boolean;
}

/* ─── Reusable dropdown wrapper ─── */

function useOutsideClick(ref: React.RefObject<HTMLDivElement | null>, onClose: () => void) {
  useEffect(() => {
    function handler(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) onClose();
    }
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [ref, onClose]);
}

/* ─── Searchable multi-select dropdown ─── */

function SearchableDropdown({
  label,
  options,
  selected,
  onChange,
}: {
  label: string;
  options: string[];
  selected: string[];
  onChange: (val: string[]) => void;
}) {
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState("");
  const ref = useRef<HTMLDivElement | null>(null);
  useOutsideClick(ref, () => setOpen(false));

  const filtered = search
    ? options.filter((o) => o.toLowerCase().includes(search.toLowerCase()))
    : options;

  const toggle = (val: string) => {
    onChange(
      selected.includes(val)
        ? selected.filter((s) => s !== val)
        : [...selected, val]
    );
  };

  return (
    <div ref={ref} className="relative">
      <button
        onClick={() => setOpen(!open)}
        className="flex items-center gap-1.5 px-3 py-1.5 rounded-md text-sm bg-white/10 hover:bg-white/20 text-white transition-colors whitespace-nowrap"
      >
        <span>{label}</span>
        {selected.length > 0 && (
          <span className="bg-blue-500 text-white text-xs font-semibold rounded-full w-5 h-5 flex items-center justify-center">
            {selected.length}
          </span>
        )}
        <svg className={`w-3.5 h-3.5 transition-transform ${open ? "rotate-180" : ""}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {open && (
        <div className="absolute top-full left-0 mt-1 w-64 bg-white rounded-lg shadow-xl border border-gray-200 z-50 overflow-hidden">
          <div className="p-2 border-b border-gray-100">
            <input
              type="text"
              placeholder={`Search ${label.toLowerCase()}...`}
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full px-2.5 py-1.5 text-sm border border-gray-200 rounded-md text-gray-800 focus:outline-none focus:ring-1 focus:ring-blue-500"
              autoFocus
            />
          </div>
          <div className="max-h-60 overflow-y-auto">
            {filtered.length === 0 ? (
              <p className="text-sm text-gray-400 p-3">No matches</p>
            ) : (
              filtered.map((opt) => (
                <button
                  key={opt}
                  onClick={() => toggle(opt)}
                  className={`w-full text-left px-3 py-1.5 text-sm flex items-center gap-2 hover:bg-gray-50 transition-colors ${
                    selected.includes(opt) ? "bg-blue-50 text-blue-700 font-medium" : "text-gray-700"
                  }`}
                >
                  <span className={`w-4 h-4 rounded border flex items-center justify-center text-xs ${
                    selected.includes(opt) ? "bg-blue-600 border-blue-600 text-white" : "border-gray-300"
                  }`}>
                    {selected.includes(opt) && "\u2713"}
                  </span>
                  {opt}
                </button>
              ))
            )}
          </div>
          {selected.length > 0 && (
            <div className="p-2 border-t border-gray-100">
              <button
                onClick={() => onChange([])}
                className="text-xs text-red-500 hover:text-red-700"
              >
                Clear selection
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

/* ─── Simple multi-select dropdown (no search) ─── */

function SimpleDropdown({
  label,
  options,
  selected,
  onChange,
}: {
  label: string;
  options: string[];
  selected: string[];
  onChange: (val: string[]) => void;
}) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement | null>(null);
  useOutsideClick(ref, () => setOpen(false));

  const toggle = (val: string) => {
    onChange(
      selected.includes(val)
        ? selected.filter((s) => s !== val)
        : [...selected, val]
    );
  };

  return (
    <div ref={ref} className="relative">
      <button
        onClick={() => setOpen(!open)}
        className="flex items-center gap-1.5 px-3 py-1.5 rounded-md text-sm bg-white/10 hover:bg-white/20 text-white transition-colors whitespace-nowrap"
      >
        <span>{label}</span>
        {selected.length > 0 && (
          <span className="bg-blue-500 text-white text-xs font-semibold rounded-full w-5 h-5 flex items-center justify-center">
            {selected.length}
          </span>
        )}
        <svg className={`w-3.5 h-3.5 transition-transform ${open ? "rotate-180" : ""}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {open && (
        <div className="absolute top-full left-0 mt-1 w-52 bg-white rounded-lg shadow-xl border border-gray-200 z-50 overflow-hidden">
          <div className="max-h-60 overflow-y-auto">
            {options.map((opt) => (
              <button
                key={opt}
                onClick={() => toggle(opt)}
                className={`w-full text-left px-3 py-1.5 text-sm flex items-center gap-2 hover:bg-gray-50 transition-colors ${
                  selected.includes(opt) ? "bg-blue-50 text-blue-700 font-medium" : "text-gray-700"
                }`}
              >
                <span className={`w-4 h-4 rounded border flex items-center justify-center text-xs ${
                  selected.includes(opt) ? "bg-blue-600 border-blue-600 text-white" : "border-gray-300"
                }`}>
                  {selected.includes(opt) && "\u2713"}
                </span>
                {opt}
              </button>
            ))}
          </div>
          {selected.length > 0 && (
            <div className="p-2 border-t border-gray-100">
              <button
                onClick={() => onChange([])}
                className="text-xs text-red-500 hover:text-red-700"
              >
                Clear selection
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

/* ─── FIFA Version multi-select with checkboxes ─── */

function FifaVersionDropdown({
  options,
  selected,
  onChange,
}: {
  options: number[];
  selected: number[];
  onChange: (val: number[]) => void;
}) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement | null>(null);
  useOutsideClick(ref, () => setOpen(false));

  const toggle = (val: number) => {
    onChange(
      selected.includes(val)
        ? selected.filter((s) => s !== val)
        : [...selected, val]
    );
  };

  return (
    <div ref={ref} className="relative">
      <button
        onClick={() => setOpen(!open)}
        className="flex items-center gap-1.5 px-3 py-1.5 rounded-md text-sm bg-white/10 hover:bg-white/20 text-white transition-colors whitespace-nowrap"
      >
        <span>FIFA Version</span>
        {selected.length > 0 && (
          <span className="bg-blue-500 text-white text-xs font-semibold rounded-full w-5 h-5 flex items-center justify-center">
            {selected.length}
          </span>
        )}
        <svg className={`w-3.5 h-3.5 transition-transform ${open ? "rotate-180" : ""}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {open && (
        <div className="absolute top-full left-0 mt-1 w-44 bg-white rounded-lg shadow-xl border border-gray-200 z-50 overflow-hidden">
          <div className="max-h-60 overflow-y-auto">
            {options.map((v) => (
              <button
                key={v}
                onClick={() => toggle(v)}
                className={`w-full text-left px-3 py-1.5 text-sm flex items-center gap-2 hover:bg-gray-50 transition-colors ${
                  selected.includes(v) ? "bg-blue-50 text-blue-700 font-medium" : "text-gray-700"
                }`}
              >
                <span className={`w-4 h-4 rounded border flex items-center justify-center text-xs ${
                  selected.includes(v) ? "bg-blue-600 border-blue-600 text-white" : "border-gray-300"
                }`}>
                  {selected.includes(v) && "\u2713"}
                </span>
                FIFA {v}
              </button>
            ))}
          </div>
          {selected.length > 0 && (
            <div className="p-2 border-t border-gray-100">
              <button
                onClick={() => onChange([])}
                className="text-xs text-red-500 hover:text-red-700"
              >
                Clear selection
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

/* ─── Main FilterBar ─── */

export default function FilterBar({
  filters,
  filterOptions,
  onFilterChange,
  onClearAll,
  hasActiveFilters,
}: FilterBarProps) {
  const handleStarterToggle = useCallback(() => {
    onFilterChange("is_starter", filters.is_starter === true ? null : true);
  }, [filters.is_starter, onFilterChange]);

  return (
    <div className="sticky top-14 z-40 bg-navy border-b border-white/10">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center gap-2 py-2.5 flex-wrap">
          <span className="text-xs font-semibold text-gray-400 uppercase tracking-wider mr-1">
            Filters
          </span>

          <SearchableDropdown
            label={FILTER_LABELS.nationality_name}
            options={filterOptions.nationality_name}
            selected={filters.nationality_name}
            onChange={(v) => onFilterChange("nationality_name", v)}
          />

          <SimpleDropdown
            label={FILTER_LABELS.position_group}
            options={filterOptions.position_group}
            selected={filters.position_group}
            onChange={(v) => onFilterChange("position_group", v)}
          />

          <SearchableDropdown
            label={FILTER_LABELS.league_name}
            options={filterOptions.league_name}
            selected={filters.league_name}
            onChange={(v) => onFilterChange("league_name", v)}
          />

          <SimpleDropdown
            label={FILTER_LABELS.rating_tier}
            options={filterOptions.rating_tier}
            selected={filters.rating_tier}
            onChange={(v) => onFilterChange("rating_tier", v)}
          />

          <FifaVersionDropdown
            options={filterOptions.fifa_version}
            selected={filters.fifa_version}
            onChange={(v) => onFilterChange("fifa_version", v)}
          />

          <SimpleDropdown
            label={FILTER_LABELS.football_year_type}
            options={filterOptions.football_year_type}
            selected={filters.football_year_type}
            onChange={(v) => onFilterChange("football_year_type", v)}
          />

          <button
            onClick={handleStarterToggle}
            className={`px-3 py-1.5 rounded-md text-sm transition-colors whitespace-nowrap ${
              filters.is_starter === true
                ? "bg-blue-500 text-white"
                : "bg-white/10 hover:bg-white/20 text-white"
            }`}
          >
            {filters.is_starter === true ? "Starters Only" : "All Players"}
          </button>

          {hasActiveFilters && (
            <button
              onClick={onClearAll}
              className="ml-auto px-3 py-1.5 rounded-md text-sm bg-red-500/20 hover:bg-red-500/30 text-red-300 transition-colors whitespace-nowrap"
            >
              Clear All
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
