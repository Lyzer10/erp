import { createFileRoute } from "@tanstack/react-router";
import { PageHeader } from "@/components/erp/PageHeader";
import { GlassCard } from "@/components/erp/GlassCard";
import { ChevronRight } from "lucide-react";
import { useState } from "react";
import { cn } from "@/lib/utils";

const tree = [
  { code: "1000", name: "Assets", children: [
    { code: "1100", name: "Current Assets", children: [
      { code: "1110", name: "Cash" }, { code: "1120", name: "Bank Accounts" }, { code: "1130", name: "Accounts Receivable" }, { code: "1140", name: "Inventory" },
    ]},
    { code: "1200", name: "Fixed Assets", children: [{ code: "1210", name: "Equipment" }, { code: "1220", name: "Vehicles" }] },
  ]},
  { code: "2000", name: "Liabilities", children: [{ code: "2100", name: "Accounts Payable" }, { code: "2200", name: "Loans" }] },
  { code: "3000", name: "Equity", children: [{ code: "3100", name: "Capital" }, { code: "3200", name: "Retained Earnings" }] },
  { code: "4000", name: "Revenue", children: [{ code: "4100", name: "Sales" }, { code: "4200", name: "Service Income" }] },
  { code: "5000", name: "Expenses", children: [{ code: "5100", name: "COGS" }, { code: "5200", name: "Salaries" }, { code: "5300", name: "Rent" }, { code: "5400", name: "Utilities" }] },
];

type Node = { code: string; name: string; children?: Node[] };

function TreeNode({ node, depth = 0 }: { node: Node; depth?: number }) {
  const [open, setOpen] = useState(depth < 1);
  const hasChildren = !!node.children?.length;
  return (
    <div>
      <button onClick={() => setOpen((v) => !v)} disabled={!hasChildren}
        className="flex w-full items-center gap-2 rounded-lg px-2 py-2 text-left text-sm transition hover:bg-white/50"
        style={{ paddingLeft: 8 + depth * 18 }}>
        {hasChildren ? <ChevronRight className={cn("h-3.5 w-3.5 text-muted-foreground transition", open && "rotate-90")} />
          : <span className="h-3.5 w-3.5" />}
        <span className="font-mono text-xs text-muted-foreground">{node.code}</span>
        <span className="font-medium">{node.name}</span>
      </button>
      {hasChildren && open && <div>{node.children!.map((c) => <TreeNode key={c.code} node={c} depth={depth + 1} />)}</div>}
    </div>
  );
}

export const Route = createFileRoute("/_app/finance/chart-of-accounts")({
  head: () => ({ meta: [{ title: "Chart of Accounts — Lumen ERP" }] }),
  component: () => (
    <div className="space-y-6">
      <PageHeader title="Chart of Accounts" description="Hierarchical structure of all financial accounts." />
      <GlassCard>{tree.map((n) => <TreeNode key={n.code} node={n} />)}</GlassCard>
    </div>
  ),
});
