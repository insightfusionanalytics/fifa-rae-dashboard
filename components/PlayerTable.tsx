"use client";

import { useState, useEffect, useRef, useCallback, useMemo } from "react";
import {
  useReactTable,
  getCoreRowModel,
  flexRender,
  createColumnHelper,
  type SortingState,
} from "@tanstack/react-table";
import type { FilterState, PlayerTableRow, PaginatedResponse } from "@/lib/types";

interface PlayerTableProps {
  filters: FilterState;
}

const columnHelper = createColumnHelper<PlayerTableRow>();

function buildQueryString(
  filters: FilterState,
  page: number,
  pageSize: number,
  search: string,
  sorting: SortingState
): string {
  const params = new URLSearchParams();
  params.set("page", String(page));
  params.set("pageSize", String(pageSize));

  if (search) params.set("search", search);

  if (sorting.length > 0) {
    params.set("sort", sorting[0].id);
    params.set("order", sorting[0].desc ? "desc" : "asc");
  }

  const arrayKeys = [
    "nationality_name",
    "position_group",
    "league_name",
    "rating_tier",
    "football_year_type",
  ] as const;

  for (const key of arrayKeys) {
    if (filters[key].length > 0) {
      params.set(key, filters[key].join(","));
    }
  }

  if (filters.fifa_version.length > 0) {
    params.set("fifa_version", filters.fifa_version.join(","));
  }

  if (filters.is_starter !== null) {
    params.set("is_starter", String(filters.is_starter));
  }

  return params.toString();
}

const QUARTER_LABELS: Record<number, string> = {
  1: "Q1",
  2: "Q2",
  3: "Q3",
  4: "Q4",
};

export default function PlayerTable({ filters }: PlayerTableProps) {
  const [data, setData] = useState<PlayerTableRow[]>([]);
  const [total, setTotal] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [page, setPage] = useState(1);
  const [pageSize] = useState(50);
  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [sorting, setSorting] = useState<SortingState>([{ id: "overall", desc: true }]);
  const [isLoading, setIsLoading] = useState(false);
  const abortRef = useRef<AbortController | null>(null);
  const searchTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Debounce search input
  useEffect(() => {
    if (searchTimerRef.current) clearTimeout(searchTimerRef.current);
    searchTimerRef.current = setTimeout(() => {
      setDebouncedSearch(search);
      setPage(1);
    }, 300);
    return () => {
      if (searchTimerRef.current) clearTimeout(searchTimerRef.current);
    };
  }, [search]);

  // Reset page when filters change
  useEffect(() => {
    setPage(1);
  }, [filters]);

  // Fetch data
  const fetchData = useCallback(() => {
    if (abortRef.current) abortRef.current.abort();
    const controller = new AbortController();
    abortRef.current = controller;

    setIsLoading(true);
    const qs = buildQueryString(filters, page, pageSize, debouncedSearch, sorting);

    fetch(`/api/players?${qs}`, { signal: controller.signal })
      .then((res) => res.json())
      .then((resp: PaginatedResponse) => {
        setData(resp.rows);
        setTotal(resp.total);
        setTotalPages(resp.totalPages);
        setIsLoading(false);
      })
      .catch((err) => {
        if (err.name !== "AbortError") {
          console.error("Failed to fetch players:", err);
          setIsLoading(false);
        }
      });
  }, [filters, page, pageSize, debouncedSearch, sorting]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const columns = useMemo(
    () => [
      columnHelper.accessor("short_name", {
        header: "Player",
        cell: (info) => (
          <div>
            <span className="font-medium text-gray-900">{info.getValue()}</span>
          </div>
        ),
      }),
      columnHelper.accessor("position_group", {
        header: "Position",
        cell: (info) => (
          <span className="text-xs bg-gray-100 px-2 py-0.5 rounded-full text-gray-600">
            {info.getValue()}
          </span>
        ),
      }),
      columnHelper.accessor("nationality_name", {
        header: "Country",
      }),
      columnHelper.accessor("league_name", {
        header: "League",
        cell: (info) => (
          <span className="text-sm text-gray-600 truncate max-w-[150px] block">
            {info.getValue()}
          </span>
        ),
      }),
      columnHelper.accessor("club_name", {
        header: "Club",
        cell: (info) => (
          <span className="text-sm text-gray-600 truncate max-w-[130px] block">
            {info.getValue()}
          </span>
        ),
      }),
      columnHelper.accessor("overall", {
        header: "Rating",
        cell: (info) => (
          <span className="font-semibold text-navy">{info.getValue()}</span>
        ),
      }),
      columnHelper.accessor("potential", {
        header: "Potential",
      }),
      columnHelper.accessor("age", {
        header: "Age",
      }),
      columnHelper.accessor("football_year_quarter", {
        header: "Birth Q (FY)",
        cell: (info) => {
          const q = info.getValue();
          return (
            <span
              className={`text-xs font-semibold px-2 py-0.5 rounded-full ${
                q === 1
                  ? "bg-blue-100 text-blue-700"
                  : q === 2
                  ? "bg-purple-100 text-purple-700"
                  : q === 3
                  ? "bg-red-100 text-red-700"
                  : "bg-amber-100 text-amber-700"
              }`}
            >
              {QUARTER_LABELS[q] ?? `Q${q}`}
            </span>
          );
        },
      }),
      columnHelper.accessor("fifa_version", {
        header: "FIFA",
        cell: (info) => <span className="text-gray-500">{info.getValue()}</span>,
      }),
    ],
    []
  );

  const table = useReactTable({
    data,
    columns,
    state: { sorting },
    onSortingChange: setSorting,
    getCoreRowModel: getCoreRowModel(),
    manualSorting: true,
    manualPagination: true,
    pageCount: totalPages,
  });

  const startRow = (page - 1) * pageSize + 1;
  const endRow = Math.min(page * pageSize, total);

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
      {/* Search */}
      <div className="p-4 border-b border-gray-100 flex items-center gap-3 flex-wrap">
        <div className="relative flex-1 min-w-[200px]">
          <svg
            className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
            />
          </svg>
          <input
            type="text"
            placeholder="Search player name..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-500"
          />
        </div>
        <span className="text-xs text-gray-400">
          {total.toLocaleString()} players found
        </span>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            {table.getHeaderGroups().map((headerGroup) => (
              <tr key={headerGroup.id} className="border-b border-gray-100 bg-gray-50/50">
                {headerGroup.headers.map((header) => (
                  <th
                    key={header.id}
                    className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider cursor-pointer hover:text-gray-700 transition-colors select-none"
                    onClick={header.column.getToggleSortingHandler()}
                  >
                    <div className="flex items-center gap-1">
                      {flexRender(header.column.columnDef.header, header.getContext())}
                      {header.column.getIsSorted() === "asc" && (
                        <svg className="w-3 h-3" viewBox="0 0 24 24" fill="currentColor"><path d="M12 4l-8 8h16z" /></svg>
                      )}
                      {header.column.getIsSorted() === "desc" && (
                        <svg className="w-3 h-3" viewBox="0 0 24 24" fill="currentColor"><path d="M12 20l-8-8h16z" /></svg>
                      )}
                    </div>
                  </th>
                ))}
              </tr>
            ))}
          </thead>
          <tbody>
            {isLoading ? (
              Array.from({ length: 10 }).map((_, i) => (
                <tr key={`skeleton-${i}`} className="border-b border-gray-50">
                  {columns.map((_, j) => (
                    <td key={j} className="px-4 py-3">
                      <div className="h-4 bg-gray-100 rounded animate-pulse" />
                    </td>
                  ))}
                </tr>
              ))
            ) : data.length === 0 ? (
              <tr>
                <td colSpan={columns.length} className="px-4 py-12 text-center text-gray-400">
                  No players found for the current filters.
                </td>
              </tr>
            ) : (
              table.getRowModel().rows.map((row) => (
                <tr
                  key={row.id}
                  className="border-b border-gray-50 hover:bg-gray-50/50 transition-colors"
                >
                  {row.getVisibleCells().map((cell) => (
                    <td key={cell.id} className="px-4 py-2.5">
                      {flexRender(cell.column.columnDef.cell, cell.getContext())}
                    </td>
                  ))}
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      <div className="p-4 border-t border-gray-100 flex items-center justify-between">
        <span className="text-sm text-gray-500">
          {total > 0
            ? `Showing ${startRow.toLocaleString()}-${endRow.toLocaleString()} of ${total.toLocaleString()}`
            : "No results"}
        </span>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setPage((p) => Math.max(1, p - 1))}
            disabled={page <= 1 || isLoading}
            className="px-3 py-1.5 text-sm border border-gray-200 rounded-md hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
          >
            Previous
          </button>
          <span className="text-sm text-gray-500">
            Page {page} of {totalPages || 1}
          </span>
          <button
            onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
            disabled={page >= totalPages || isLoading}
            className="px-3 py-1.5 text-sm border border-gray-200 rounded-md hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
          >
            Next
          </button>
        </div>
      </div>
    </div>
  );
}
