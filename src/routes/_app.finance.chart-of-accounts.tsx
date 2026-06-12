import { createFileRoute } from "@tanstack/react-router";
import { PageHeader } from "@/components/erp/PageHeader";
import { GlassCard } from "@/components/erp/GlassCard";
import { ChevronRight } from "lucide-react";
import { useState } from "react";
import { cn } from "@/lib/utils";
import { useTranslate } from "@/lib/i18n";

type Node = { code: string; name: string; children?: Node[] };

const getTree = (lang: string): Node[] => [
  { code: "1000", name: lang === "en" ? "Assets" : "Rasilimali", children: [
    { code: "1100", name: lang === "en" ? "Current Assets" : "Rasilimali za Sasa", children: [
      { code: "1110", name: lang === "en" ? "Cash" : "Fedha Taslimu" }, 
      { code: "1120", name: lang === "en" ? "Bank Accounts" : "Akaunti za Benki" }, 
      { code: "1130", name: lang === "en" ? "Accounts Receivable" : "Madai ya Wateja" }, 
      { code: "1140", name: lang === "en" ? "Inventory" : "Bidhaa Stoo" },
    ]},
    { code: "1200", name: lang === "en" ? "Fixed Assets" : "Rasilimali Zisizohamishika", children: [
      { code: "1210", name: lang === "en" ? "Equipment" : "Vifaa" }, 
      { code: "1220", name: lang === "en" ? "Vehicles" : "Magari" }
    ] },
  ]},
  { code: "2000", name: lang === "en" ? "Liabilities" : "Dhima / Madeni", children: [
    { code: "2100", name: lang === "en" ? "Accounts Payable" : "Madeni ya Wauzaji" }, 
    { code: "2200", name: lang === "en" ? "Loans" : "Mikopo" }
  ] },
  { code: "3000", name: lang === "en" ? "Equity" : "Mtaji / Ekwiti", children: [
    { code: "3100", name: lang === "en" ? "Capital" : "Mtaji" }, 
    { code: "3200", name: lang === "en" ? "Retained Earnings" : "Mapato Yaliyolimbikizwa" }
  ] },
  { code: "4000", name: lang === "en" ? "Revenue" : "Mapato", children: [
    { code: "4100", name: lang === "en" ? "Sales" : "Mauzo" }, 
    { code: "4200", name: lang === "en" ? "Service Income" : "Mapato ya Huduma" }
  ] },
  { code: "5000", name: lang === "en" ? "Expenses" : "Matumizi", children: [
    { code: "5100", name: lang === "en" ? "COGS" : "Gharama ya Bidhaa Zilizouzwa" }, 
    { code: "5200", name: lang === "en" ? "Salaries" : "Mishahara" }, 
    { code: "5300", name: lang === "en" ? "Rent" : "Kodi ya Pango" }, 
    { code: "5400", name: lang === "en" ? "Utilities" : "Huduma za Jamii" }
  ] },
];

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
  component: ChartOfAccountsPage,
});

function ChartOfAccountsPage() {
  const { t, lang } = useTranslate();
  const tree = getTree(lang);
  return (
    <div className="space-y-6">
      <PageHeader 
        title={lang === "en" ? "Chart of Accounts" : "Chati ya Akaunti"} 
        description={lang === "en" ? "Hierarchical structure of all financial accounts." : "Muundo wa uongozi wa akaunti zote za kifedha."} 
      />
      <GlassCard>{tree.map((n) => <TreeNode key={n.code} node={n} />)}</GlassCard>
    </div>
  );
}
