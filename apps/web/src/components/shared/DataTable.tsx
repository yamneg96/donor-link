import { useState, useMemo } from "react";
import {
  useReactTable,
  getCoreRowModel,
  getSortedRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  flexRender,
  type ColumnDef,
  type SortingState,
} from "@tanstack/react-table";
import { cn } from "../../lib/utils";
import { MaterialIcon } from "./MaterialIcon";
import { LoadingSkeleton } from "./EmptyState";

interface DataTableProps<TData> {
  columns: ColumnDef<TData, any>[];
  data: TData[];
  isLoading?: boolean;
  emptyMessage?: string;
  emptyIcon?: string;
  className?: string;
  searchable?: boolean;
  searchPlaceholder?: string;
  pageSize?: number;
  onRowClick?: (row: TData) => void;
  enableExport?: boolean;
  exportFilename?: string;
}

export function DataTable<TData>({
  columns,
  data,
  isLoading = false,
  emptyMessage = "No data found",
  emptyIcon = "inventory_2",
  className,
  searchable = true,
  searchPlaceholder = "Search…",
  pageSize = 10,
  onRowClick,
  enableExport = false,
  exportFilename = "export",
}: DataTableProps<TData>) {
  const [sorting, setSorting] = useState<SortingState>([]);
  const [globalFilter, setGlobalFilter] = useState("");

  const table = useReactTable({
    data,
    columns,
    state: { sorting, globalFilter },
    onSortingChange: setSorting,
    onGlobalFilterChange: setGlobalFilter,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    initialState: { pagination: { pageSize } },
  });

  const pageCount = table.getPageCount();
  const currentPage = table.getState().pagination.pageIndex + 1;

  // CSV export
  const handleExport = () => {
    const headers = columns.map((c) => (typeof c.header === "string" ? c.header : ""));
    const rows = table.getFilteredRowModel().rows.map((row) =>
      row.getVisibleCells().map((cell) => {
        const val = cell.getValue();
        return typeof val === "string" ? `"${val}"` : String(val ?? "");
      })
    );
    const csv = [headers.join(","), ...rows.map((r) => r.join(","))].join("\n");
    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${exportFilename}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className={cn("bg-m3-surface-container-lowest border border-m3-outline-variant rounded-xl shadow-ambient-md overflow-hidden", className)}>
      {/* Toolbar */}
      {(searchable || enableExport) && (
        <div className="flex items-center justify-between gap-3 p-3 border-b border-m3-outline-variant">
          {searchable && (
            <div className="relative flex-1 max-w-sm">
              <MaterialIcon icon="search" size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-m3-on-surface-variant" />
              <input
                value={globalFilter}
                onChange={(e) => setGlobalFilter(e.target.value)}
                placeholder={searchPlaceholder}
                className="w-full pl-9 pr-3 py-2 border border-m3-outline-variant rounded-lg bg-m3-surface-container-lowest text-body-compact text-m3-on-surface focus:outline-none focus:border-m3-primary focus:ring-1 focus:ring-m3-primary text-sm"
              />
            </div>
          )}
          <div className="flex items-center gap-2">
            {enableExport && (
              <button onClick={handleExport} className="flex items-center gap-1.5 px-3 py-2 border border-m3-outline-variant rounded-lg text-label-caps text-m3-on-surface hover:bg-m3-surface-variant transition-colors text-xs">
                <MaterialIcon icon="download" size={16} /> Export CSV
              </button>
            )}
            <span className="text-label-caps text-m3-on-surface-variant text-xs">
              {table.getFilteredRowModel().rows.length} row{table.getFilteredRowModel().rows.length !== 1 ? "s" : ""}
            </span>
          </div>
        </div>
      )}

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead className="bg-m3-surface-container-low text-label-caps text-m3-secondary border-b border-m3-outline-variant">
            {table.getHeaderGroups().map((headerGroup) => (
              <tr key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <th
                    key={header.id}
                    className={cn("p-3 font-semibold select-none", header.column.getCanSort() && "cursor-pointer hover:text-m3-primary transition-colors")}
                    onClick={header.column.getToggleSortingHandler()}
                  >
                    <div className="flex items-center gap-1">
                      {header.isPlaceholder ? null : flexRender(header.column.columnDef.header, header.getContext())}
                      {header.column.getIsSorted() === "asc" && <MaterialIcon icon="arrow_upward" size={14} />}
                      {header.column.getIsSorted() === "desc" && <MaterialIcon icon="arrow_downward" size={14} />}
                    </div>
                  </th>
                ))}
              </tr>
            ))}
          </thead>
          <tbody className="text-data-mono divide-y divide-m3-outline-variant">
            {isLoading ? (
              <tr>
                <td colSpan={columns.length} className="p-8">
                  <LoadingSkeleton rows={4} />
                </td>
              </tr>
            ) : table.getRowModel().rows.length > 0 ? (
              table.getRowModel().rows.map((row) => (
                <tr
                  key={row.id}
                  onClick={() => onRowClick?.(row.original)}
                  className={cn("transition-colors", onRowClick ? "cursor-pointer hover:bg-m3-surface-container-low" : "hover:bg-m3-surface-container-lowest")}
                >
                  {row.getVisibleCells().map((cell) => (
                    <td key={cell.id} className="p-3">
                      {flexRender(cell.column.columnDef.cell, cell.getContext())}
                    </td>
                  ))}
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={columns.length} className="p-12 text-center text-m3-on-surface-variant">
                  <div className="flex flex-col items-center gap-2">
                    <MaterialIcon icon={emptyIcon} className="text-m3-outline/30" size={48} />
                    <p className="text-body-compact">{emptyMessage}</p>
                  </div>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      {pageCount > 1 && (
        <div className="flex items-center justify-between p-3 border-t border-m3-outline-variant">
          <p className="text-label-caps text-m3-on-surface-variant text-xs">
            Page {currentPage} of {pageCount}
          </p>
          <div className="flex items-center gap-1">
            <button onClick={() => table.setPageIndex(0)} disabled={!table.getCanPreviousPage()} className="p-1.5 rounded hover:bg-m3-surface-variant disabled:opacity-30 transition-colors">
              <MaterialIcon icon="first_page" size={18} />
            </button>
            <button onClick={() => table.previousPage()} disabled={!table.getCanPreviousPage()} className="p-1.5 rounded hover:bg-m3-surface-variant disabled:opacity-30 transition-colors">
              <MaterialIcon icon="chevron_left" size={18} />
            </button>
            <button onClick={() => table.nextPage()} disabled={!table.getCanNextPage()} className="p-1.5 rounded hover:bg-m3-surface-variant disabled:opacity-30 transition-colors">
              <MaterialIcon icon="chevron_right" size={18} />
            </button>
            <button onClick={() => table.setPageIndex(pageCount - 1)} disabled={!table.getCanNextPage()} className="p-1.5 rounded hover:bg-m3-surface-variant disabled:opacity-30 transition-colors">
              <MaterialIcon icon="last_page" size={18} />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
