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

export function DataTable<T extends Record<string, unknown>>({
  data,
  columns,
  searchable = true,
  pageSize = 10,
  emptyMessage = "No records found.",
}: Props<T>) {
  const [q, setQ] = useState("");
  const [page, setPage] = useState(1);

  const filtered = useMemo(() => {
    if (!q) return data;
    const lc = q.toLowerCase();
    return data.filter((r) =>
      Object.values(r).some((v) => String(v ?? "").toLowerCase().includes(lc)),
    );
  }, [data, q]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / pageSize));
  const start = (page - 1) * pageSize;
  const pageRows = filtered.slice(start, start + pageSize);

  return (
    <div className="glass-card overflow-hidden p-0">
      {searchable && (
        <div className="flex items-center justify-between gap-2 border-b border-white/40 p-4">
          <div className="relative max-w-xs flex-1">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              value={q}
              onChange={(e) => { setQ(e.target.value); setPage(1); }}
              placeholder="Search..."
              className="border-white/60 bg-white/60 pl-9 backdrop-blur"
            />
          </div>
          <span className="text-xs text-muted-foreground">{filtered.length} records</span>
        </div>
      )}
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-white/40 bg-white/30 text-xs uppercase tracking-wider text-muted-foreground">
              {columns.map((c) => (
                <th key={c.key} className={cn("px-4 py-3 text-left font-medium",
                  c.align === "right" && "text-right",
                  c.align === "center" && "text-center",
                  c.className)}>{c.header}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {pageRows.length === 0 ? (
              <tr>
                <td colSpan={columns.length} className="px-4 py-10 text-center text-muted-foreground">{emptyMessage}</td>
              </tr>
            ) : pageRows.map((row, i) => (
              <tr key={i} className="border-b border-white/20 transition-colors hover:bg-white/40">
                {columns.map((c) => (
                  <td key={c.key} className={cn("px-4 py-3",
                    c.align === "right" && "text-right",
                    c.align === "center" && "text-center",
                    c.className)}>
                    {c.render ? c.render(row) : String(row[c.key] ?? "")}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {totalPages > 1 && (
        <div className="flex items-center justify-between border-t border-white/40 px-4 py-3 text-sm">
          <span className="text-muted-foreground">Page {page} of {totalPages}</span>
          <div className="flex gap-2">
            <button onClick={() => setPage((p) => Math.max(1, p - 1))} disabled={page === 1}
              className="rounded-md border border-white/60 bg-white/60 px-3 py-1 text-xs font-medium backdrop-blur transition disabled:opacity-40">Previous</button>
            <button onClick={() => setPage((p) => Math.min(totalPages, p + 1))} disabled={page === totalPages}
              className="rounded-md border border-white/60 bg-white/60 px-3 py-1 text-xs font-medium backdrop-blur transition disabled:opacity-40">Next</button>
          </div>
        </div>
      )}
    </div>
  );
}
