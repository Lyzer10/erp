import { createFileRoute } from "@tanstack/react-router";
import { PageHeader } from "@/components/erp/PageHeader";
import { TabbedPage } from "@/components/erp/TabbedPage";
import { DataTable } from "@/components/erp/DataTable";
import { StatusPill } from "@/components/erp/StatusPill";
import { payrollRuns, currency } from "@/lib/mock";
import { Play } from "lucide-react";

export const Route = createFileRoute("/_app/hr/payroll")({
  head: () => ({ meta: [{ title: "Payroll — Lumen ERP" }] }),
  component: PayrollPage,
});

const num = (n: number) => new Intl.NumberFormat("en-US").format(n);

type Row = {
  name: string; basic: number; allowance: number; gross: number; nssf: number;
  taxable: number; paye: number; wcf: number; nhif: number; sdl: number;
  heslb: number; saccoss: number; social: number; advance: number; loan: number;
  loss: number; other: number; totalDed: number; net: number;
};

const previewRows: Row[] = [
  { name: "John Mwamba",  basic:   800_000, allowance: 150_000, gross:   950_000, nssf:  60_000, taxable:   890_000, paye: 120_000, wcf:  9_500, nhif: 30_000, sdl: 14_250, heslb: 0, saccoss: 0, social: 0, advance: 50_000, loan: 0, loss: 0, other: 0, totalDed: 283_750, net: 666_250 },
  { name: "Fatuma Ally",  basic:   650_000, allowance: 100_000, gross:   750_000, nssf:  45_000, taxable:   705_000, paye:  85_000, wcf:  7_500, nhif: 22_500, sdl: 11_250, heslb: 0, saccoss: 0, social: 0, advance: 30_000, loan: 0, loss: 0, other: 0, totalDed: 201_250, net: 548_750 },
  { name: "Peter Nkosi",  basic: 1_200_000, allowance: 250_000, gross: 1_450_000, nssf: 100_000, taxable: 1_350_000, paye: 280_000, wcf: 14_500, nhif: 45_000, sdl: 21_750, heslb: 0, saccoss: 0, social: 0, advance: 80_000, loan: 0, loss: 0, other: 0, totalDed: 541_250, net: 908_750 },
];

const totalsRow = previewRows.reduce<Row>((acc, r) => {
  (Object.keys(r) as (keyof Row)[]).forEach((k) => {
    if (k !== "name") (acc as any)[k] = ((acc as any)[k] || 0) + (r as any)[k];
  });
  return acc;
}, { name: "Totals" } as Row);

const PAYROLL_COLS: { key: keyof Row | "sn"; label: string; width?: string; sticky?: boolean }[] = [
  { key: "sn",        label: "S/N",                width: "48px" },
  { key: "name",      label: "Employee Name",      width: "160px", sticky: true },
  { key: "basic",     label: "Basic Salary" },
  { key: "allowance", label: "Allowance" },
  { key: "gross",     label: "Gross Salary" },
  { key: "nssf",      label: "NSSF" },
  { key: "taxable",   label: "Taxable Income" },
  { key: "paye",      label: "PAYE Tax" },
  { key: "wcf",       label: "WCF" },
  { key: "nhif",      label: "NHIF" },
  { key: "sdl",       label: "SDL" },
  { key: "heslb",     label: "HESLB" },
  { key: "saccoss",   label: "SACCOSS" },
  { key: "social",    label: "Social" },
  { key: "advance",   label: "Salary Advance" },
  { key: "loan",      label: "Loan" },
  { key: "loss",      label: "Loss" },
  { key: "other",     label: "Other Deductions" },
  { key: "totalDed",  label: "Total Deductions" },
  { key: "net",       label: "Net Pay" },
];

function PrepareTab() {
  return (
    <div className="space-y-4">
      <div className="glass-card p-4">
        <p className="text-xs text-muted-foreground">All amounts in TZS</p>
      </div>
      <div className="glass-card overflow-hidden p-0">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-teal-600 text-xs uppercase tracking-wide text-white">
                {PAYROLL_COLS.map((c) => (
                  <th
                    key={c.key as string}
                    style={{ width: c.width, minWidth: c.width }}
                    className={`whitespace-nowrap px-3 py-3 text-left font-semibold ${c.sticky ? "sticky left-0 z-10 bg-teal-600" : ""}`}
                  >
                    {c.label}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {previewRows.map((r, i) => (
                <tr key={r.name} className="border-b border-slate-100 hover:bg-slate-50/60">
                  {PAYROLL_COLS.map((c) => {
                    const isSn = c.key === "sn";
                    const isName = c.key === "name";
                    const val = isSn ? i + 1 : (r as any)[c.key];
                    return (
                      <td
                        key={c.key as string}
                        className={`whitespace-nowrap px-3 py-2.5 ${isName ? "sticky left-0 z-10 bg-white font-medium" : ""} ${isSn ? "text-slate-500" : ""} ${!isSn && !isName ? "text-right tabular-nums" : ""}`}
                      >
                        {isSn || isName ? val : num(val as number)}
                      </td>
                    );
                  })}
                </tr>
              ))}
              <tr className="bg-slate-100 font-bold">
                {PAYROLL_COLS.map((c) => {
                  const isSn = c.key === "sn";
                  const isName = c.key === "name";
                  const val = isSn ? "" : (totalsRow as any)[c.key];
                  return (
                    <td
                      key={c.key as string}
                      className={`whitespace-nowrap px-3 py-3 ${isName ? "sticky left-0 z-10 bg-slate-100" : ""} ${!isSn && !isName ? "text-right tabular-nums" : ""}`}
                    >
                      {isSn ? "" : isName ? "Totals" : num(val as number)}
                    </td>
                  );
                })}
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

function PayrollPage() {
  const cols = [
    { key: "id", header: "Run #" },
    { key: "period", header: "Period" },
    { key: "employees", header: "Employees", align: "right" as const },
    { key: "gross", header: "Gross", align: "right" as const, render: (r: typeof payrollRuns[0]) => currency(r.gross) },
    { key: "net", header: "Net", align: "right" as const, render: (r: typeof payrollRuns[0]) => currency(r.net) },
    { key: "status", header: "Status", render: (r: typeof payrollRuns[0]) => <StatusPill status={r.status} /> },
  ];
  return (
    <div className="space-y-6">
      <PageHeader
        title="Payroll Management"
        description="Prepare, approve, and complete payroll cycles."
        actions={
          <button className="inline-flex items-center gap-2 rounded-lg bg-gradient-to-r from-blue-500 to-emerald-500 px-4 py-2 text-sm font-semibold text-white shadow-md">
            <Play className="h-4 w-4" /> Run Payroll
          </button>
        }
      />
      <TabbedPage tabs={[
        { key: "prepare",   label: "Prepare",   render: () => <PrepareTab /> },
        { key: "approved",  label: "Approved",  render: () => <DataTable data={payrollRuns.filter(p=>p.status==="Approved")} columns={cols} /> },
        { key: "completed", label: "Completed", render: () => <DataTable data={payrollRuns.filter(p=>p.status==="Completed")} columns={cols} /> },
        { key: "rejected",  label: "Rejected",  render: () => <DataTable data={payrollRuns.filter(p=>p.status==="Rejected")} columns={cols} /> },
      ]} />
    </div>
  );
}
