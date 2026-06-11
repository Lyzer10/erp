import { useMemo, useState, type ReactNode } from "react";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";
import { cn } from "@/lib/utils";

export interface Column<T> {
  key: string;
  header: string;
  render?: (row: T) => ReactNode;
  className?: string;
  align?: "left" | "right" | "center";
}

interface Props<T> {
  data: T[];
  columns: Column<T>[];
  searchable?: boolean;
  pageSize?: number;
  emptyMessage?: string;
}

function toStr(v: unknown): string {
  if (v === null || v === undefined) return "";
  if (typeof v === "object") return JSON.stringify(v);
  if (typeof v === "symbol") return v.toString();
  if (typeof v === "function") return "[Function]";
  return `${v as string | number | boolean | bigint}`;
}

function rowKey<T extends Record<string, unknown>>(row: T): string {
  return Object.values(row).slice(0, 4).map(toStr).join("|");
}

export function DataTable<T extends Record<string, unknown>>({
  data,
  columns,
  searchable = true,
  pageSize = 10,
  emptyMessage = "No records found.",
}: Readonly<Props<T>>) {
  const [q, setQ] = useState("");
  const [page, setPage] = useState(1);

  const filtered = useMemo(() => {
    if (!q) return data;
    const lc = q.toLowerCase();
    return data.filter((r) =>
      Object.values(r).some((v) => toStr(v).toLowerCase().includes(lc)),
    );
  }, [data, q]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / pageSize));
  const start = (page - 1) * pageSize;
  const pageRows = filtered.slice(start, start + pageSize);

  return (
    <div className="glass-card overflow-hidden p-0">
      {searchable && (
        <div className="flex items-center justify-between gap-3 border-b border-border px-4 py-3">
          <div className="relative max-w-xs flex-1">
            <Search className="absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-muted-foreground" />
            <Input
              value={q}
              onChange={(e) => { setQ(e.target.value); setPage(1); }}
              placeholder="Search..."
              className="h-8 bg-muted/50 pl-9 text-sm focus-visible:bg-card"
            />
          </div>
          <span className="text-xs text-muted-foreground">{filtered.length} records</span>
        </div>
      )}
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-border bg-muted/40">
              {columns.map((c) => (
                <th
                  key={c.key}
                  className={cn(
                    "px-4 py-2.5 text-left text-xs font-semibold uppercase tracking-wide text-muted-foreground",
                    c.align === "right" && "text-right",
                    c.align === "center" && "text-center",
                    c.className,
                  )}
                >
                  {c.header}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {pageRows.length === 0 ? (
              <tr>
                <td colSpan={columns.length} className="px-4 py-10 text-center text-sm text-muted-foreground">
                  {emptyMessage}
                </td>
              </tr>
            ) : pageRows.map((row) => (
              <tr
                key={rowKey(row)}
                className="border-b border-border/60 transition-colors last:border-0 hover:bg-muted/30"
              >
                {columns.map((c) => (
                  <td
                    key={c.key}
                    className={cn(
                      "px-4 py-3",
                      c.align === "right" && "text-right",
                      c.align === "center" && "text-center",
                      c.className,
                    )}
                  >
                    {c.render ? c.render(row) : toStr(row[c.key])}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {totalPages > 1 && (
        <div className="flex items-center justify-between border-t border-border px-4 py-3">
          <span className="text-xs text-muted-foreground">
            Page {page} of {totalPages} &mdash; {filtered.length} records
          </span>
          <div className="flex gap-1.5">
            <button
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              disabled={page === 1}
              className="rounded-md border border-border bg-card px-3 py-1 text-xs font-medium transition hover:bg-muted disabled:opacity-40"
            >
              Previous
            </button>
            <button
              onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
              disabled={page === totalPages}
              className="rounded-md border border-border bg-card px-3 py-1 text-xs font-medium transition hover:bg-muted disabled:opacity-40"
            >
              Next
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
