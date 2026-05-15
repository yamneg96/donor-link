import { cn } from "../../lib/utils";
import { MaterialIcon } from "./MaterialIcon";
import { LoadingSkeleton } from "./EmptyState";

interface Column<T> {
  header: string;
  accessor: keyof T | ((item: T) => React.ReactNode);
  className?: string;
  align?: "left" | "center" | "right";
}

interface DataTableProps<T> {
  columns: Column<T>[];
  data: T[];
  isLoading?: boolean;
  onRowClick?: (item: T) => void;
  emptyMessage?: string;
  className?: string;
}

export function DataTable<T extends { _id?: string }>({
  columns,
  data,
  isLoading,
  onRowClick,
  emptyMessage = "No data found",
  className,
}: DataTableProps<T>) {
  return (
    <div className={cn("overflow-x-auto", className)}>
      <table className="w-full text-left border-collapse">
        <thead className="bg-m3-surface-container-low text-label-caps text-m3-secondary border-b border-m3-outline-variant">
          <tr>
            {columns.map((col, i) => (
              <th
                key={i}
                className={cn(
                  "p-3 font-semibold",
                  col.align === "center" && "text-center",
                  col.align === "right" && "text-right",
                  col.className
                )}
              >
                {col.header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="text-data-mono divide-y divide-m3-outline-variant">
          {isLoading ? (
            <tr>
              <td colSpan={columns.length} className="p-8">
                <LoadingSkeleton rows={4} />
              </td>
            </tr>
          ) : data.length > 0 ? (
            data.map((item, i) => (
              <tr
                key={item._id || i}
                onClick={() => onRowClick?.(item)}
                className={cn(
                  "transition-colors",
                  onRowClick ? "cursor-pointer hover:bg-m3-surface-container-low" : "hover:bg-m3-surface-container-lowest"
                )}
              >
                {columns.map((col, j) => (
                  <td
                    key={j}
                    className={cn(
                      "p-3",
                      col.align === "center" && "text-center",
                      col.align === "right" && "text-right",
                      col.className
                    )}
                  >
                    {typeof col.accessor === "function"
                      ? col.accessor(item)
                      : (item[col.accessor] as React.ReactNode)}
                  </td>
                ))}
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan={columns.length} className="p-12 text-center text-m3-on-surface-variant">
                <div className="flex flex-col items-center gap-2">
                  <MaterialIcon icon="inventory_2" className="text-m3-outline/30" size={48} />
                  <p className="text-body-compact">{emptyMessage}</p>
                </div>
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}
