"use client";

import React, { useState } from "react";
import { ChevronDown, ChevronUp, Search, ChevronLeft, ChevronRight } from "lucide-react";

export interface ColumnDef<T> {
  header: string;
  accessorKey: keyof T;
  cell?: (item: T) => React.ReactNode;
  sortable?: boolean;
}

interface DataTableProps<T> {
  data: T[];
  columns: ColumnDef<T>[];
  searchPlaceholder?: string;
  searchKey?: keyof T;
}

export function DataTable<T>({ data, columns, searchPlaceholder = "Search...", searchKey }: DataTableProps<T>) {
  const [search, setSearch] = useState("");
  const [sortConfig, setSortConfig] = useState<{ key: keyof T; direction: "asc" | "desc" } | null>(null);
  const [page, setPage] = useState(1);
  const rowsPerPage = 5;

  let processedData = [...data];

  // Filtering
  if (search && searchKey) {
    processedData = processedData.filter(item => {
      const val = item[searchKey];
      return String(val).toLowerCase().includes(search.toLowerCase());
    });
  }

  // Sorting
  if (sortConfig) {
    processedData.sort((a, b) => {
      const valA = a[sortConfig.key];
      const valB = b[sortConfig.key];
      if (valA < valB) return sortConfig.direction === "asc" ? -1 : 1;
      if (valA > valB) return sortConfig.direction === "asc" ? 1 : -1;
      return 0;
    });
  }

  // Pagination
  const totalPages = Math.ceil(processedData.length / rowsPerPage) || 1;
  const paginatedData = processedData.slice((page - 1) * rowsPerPage, page * rowsPerPage);

  const handleSort = (key: keyof T) => {
    let direction: "asc" | "desc" = "asc";
    if (sortConfig && sortConfig.key === key && sortConfig.direction === "asc") {
      direction = "desc";
    }
    setSortConfig({ key, direction });
  };

  return (
    <div className="bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden flex flex-col">
      {/* Toolbar */}
      <div className="p-4 border-b border-slate-200 flex items-center justify-between bg-slate-50/50">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input 
            type="text" 
            placeholder={searchPlaceholder}
            value={search}
            onChange={(e) => { setSearch(e.target.value); setPage(1); }}
            className="pl-9 pr-4 py-2 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-white"
          />
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full text-left text-sm text-slate-600">
          <thead className="bg-slate-50 border-b border-slate-200 text-xs uppercase font-semibold text-slate-500">
            <tr>
              {columns.map((col, i) => (
                <th key={i} className="px-6 py-4">
                  {col.sortable ? (
                    <button 
                      onClick={() => handleSort(col.accessorKey)}
                      className="flex items-center gap-1 hover:text-slate-800 transition-colors focus:outline-none focus:ring-2 focus:ring-indigo-500 rounded"
                    >
                      {col.header}
                      {sortConfig?.key === col.accessorKey ? (
                        sortConfig.direction === "asc" ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />
                      ) : <ChevronDown className="w-3.5 h-3.5 opacity-0 group-hover:opacity-50" />}
                    </button>
                  ) : (
                    col.header
                  )}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {paginatedData.length > 0 ? (
              paginatedData.map((row, i) => (
                <tr key={i} className="hover:bg-slate-50/50 transition-colors">
                  {columns.map((col, j) => (
                    <td key={j} className="px-6 py-4 whitespace-nowrap">
                      {col.cell ? col.cell(row) : String(row[col.accessorKey])}
                    </td>
                  ))}
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={columns.length} className="px-6 py-12 text-center text-slate-400">
                  No results found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      <div className="p-4 border-t border-slate-200 flex items-center justify-between bg-white text-sm text-slate-500">
        <div>
          Showing {(page - 1) * rowsPerPage + 1} to {Math.min(page * rowsPerPage, processedData.length)} of {processedData.length} results
        </div>
        <div className="flex items-center gap-2">
          <button 
            disabled={page === 1}
            onClick={() => setPage(page - 1)}
            aria-label="Previous page"
            title="Previous page"
            className="p-1.5 rounded-lg border border-slate-200 hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>
          <span className="font-medium text-slate-700 px-2">{page} / {totalPages}</span>
          <button 
            disabled={page === totalPages}
            onClick={() => setPage(page + 1)}
            aria-label="Next page"
            title="Next page"
            className="p-1.5 rounded-lg border border-slate-200 hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
