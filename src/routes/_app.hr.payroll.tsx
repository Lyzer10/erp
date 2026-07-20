import { createFileRoute } from "@tanstack/react-router";
import { PageHeader } from "@/components/erp/PageHeader";
import { TabbedPage } from "@/components/erp/TabbedPage";
import { DataTable } from "@/components/erp/DataTable";
import { StatusPill } from "@/components/erp/StatusPill";
import { ExportMenu } from "@/components/erp/ExportMenu";
import { payrollRuns, currency } from "@/lib/mock";
import { Play } from "lucide-react";
import { useTranslate } from "@/lib/i18n";

import { getPayrollFn } from "@/lib/api/domain";

export const Route = createFileRoute("/_app/hr/payroll")({
  head: () => ({ meta: [{ title: "Payroll — DeveleERP" }] }),
  loader: () => getPayrollFn(),
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

function PrepareTab() {
  const { lang } = useTranslate();

  const payrollCols = [
    { key: "sn",        label: "S/N",                width: "48px" },
    { key: "name",      label: lang === "en" ? "Employee Name" : "Jina la Mfanyakazi",      width: "160px", sticky: true },
    { key: "basic",     label: lang === "en" ? "Basic Salary" : "Mshahara wa Msingi" },
    { key: "allowance", label: lang === "en" ? "Allowance" : "Posho" },
    { key: "gross",     label: lang === "en" ? "Gross Salary" : "Jumla ya Mshahara" },
    { key: "nssf",      label: "NSSF" },
    { key: "taxable",   label: lang === "en" ? "Taxable Income" : "Kipato cha Kukatwa Kodi" },
    { key: "paye",      label: lang === "en" ? "PAYE Tax" : "Kodi ya PAYE" },
    { key: "wcf",       label: "WCF" },
    { key: "nhif",      label: "NHIF" },
    { key: "sdl",       label: "SDL" },
    { key: "heslb",     label: "HESLB" },
    { key: "saccoss",   label: "SACCOSS" },
    { key: "social",    label: lang === "en" ? "Social" : "Jamii" },
    { key: "advance",   label: lang === "en" ? "Salary Advance" : "Amana ya Mshahara" },
    { key: "loan",      label: lang === "en" ? "Loan" : "Mkopo" },
    { key: "loss",      label: lang === "en" ? "Loss" : "Hasara" },
    { key: "other",     label: lang === "en" ? "Other Deductions" : "Makato Mengine" },
    { key: "totalDed",  label: lang === "en" ? "Total Deductions" : "Jumla ya Makato" },
    { key: "net",       label: lang === "en" ? "Net Pay" : "Mshahara Halisi" },
  ];

  return (
    <div className="space-y-4">
      <div className="glass-card p-4">
        <p className="text-xs text-muted-foreground">{lang === "en" ? "All amounts in TZS" : "Kiasi chote katika TZS"}</p>
      </div>
      <div className="glass-card overflow-hidden p-0">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-slate-50 text-xs uppercase tracking-wide text-slate-600">
                {payrollCols.map((c) => (
                  <th
                    key={c.key as string}
                    style={{ width: c.width, minWidth: c.width }}
                    className={`whitespace-nowrap px-3 py-3 text-left font-semibold ${c.sticky ? "sticky left-0 z-10 bg-slate-50" : ""}`}
                  >
                    {c.label}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {previewRows.map((r, i) => (
                <tr key={r.name} className="border-b border-slate-100 hover:bg-slate-50/60">
                  {payrollCols.map((c) => {
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
                {payrollCols.map((c) => {
                  const isSn = c.key === "sn";
                  const isName = c.key === "name";
                  const val = isSn ? "" : (totalsRow as any)[c.key];
                  return (
                    <td
                      key={c.key as string}
                      className={`whitespace-nowrap px-3 py-3 ${isName ? "sticky left-0 z-10 bg-slate-100" : ""} ${!isSn && !isName ? "text-right tabular-nums" : ""}`}
                    >
                      {isSn ? "" : isName ? (lang === "en" ? "Totals" : "Jumla") : num(val as number)}
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
  const { t, lang } = useTranslate();

  const cols = [
    { key: "id", header: lang === "en" ? "Run #" : "Mzunguko #" },
    { key: "period", header: lang === "en" ? "Period" : "Kipindi" },
    { key: "employees", header: lang === "en" ? "Employees" : "Wafanyakazi", align: "right" as const },
    { key: "gross", header: lang === "en" ? "Gross" : "Jumla Ghafi", align: "right" as const, render: (r: typeof payrollRuns[0]) => currency(r.gross) },
    { key: "net", header: lang === "en" ? "Net" : "Jumla Halisi", align: "right" as const, render: (r: typeof payrollRuns[0]) => currency(r.net) },
    { key: "status", header: lang === "en" ? "Status" : "Hali", render: (r: typeof payrollRuns[0]) => <StatusPill status={r.status} /> },
  ];

  const getPeriod = (period: string) => {
    if (lang === "en") return period;
    return period
      .replace("January", "Januari")
      .replace("February", "Februari")
      .replace("March", "Machi")
      .replace("April", "Aprili")
      .replace("May", "Mei")
      .replace("June", "Juni")
      .replace("July", "Julai")
      .replace("August", "Agosti")
      .replace("September", "Septemba")
      .replace("October", "Oktoba")
      .replace("November", "Novemba")
      .replace("December", "Desemba");
  };

  const localizedRuns = payrollRuns.map(r => ({
    ...r,
    period: getPeriod(r.period)
  }));

  return (
    <div className="space-y-6">
      <PageHeader
        title={lang === "en" ? "Payroll Management" : "Usimamizi wa Mishahara"}
        description={lang === "en" ? "Prepare, approve, and complete payroll cycles." : "Tayarisha, idhinisha, na ukamilishe mizunguko ya mishahara."}
        actions={
          <div className="flex items-center gap-2">
            <ExportMenu />
            <button className="inline-flex items-center gap-2 rounded-lg bg-blue-500 px-4 py-2 text-sm font-semibold text-white shadow-md hover:bg-blue-600 transition">
              <Play className="h-4 w-4" /> 
              {lang === "en" ? "Run Payroll" : "Endesha Mishahara"}
            </button>
          </div>
        }
      />
      <TabbedPage tabs={[
        { key: "prepare",   label: lang === "en" ? "Prepare" : "Tayarisha",   render: () => <PrepareTab /> },
        { key: "approved",  label: lang === "en" ? "Approved" : "Imeidhinishwa",  render: () => <DataTable data={localizedRuns.filter(p=>p.status==="Approved")} columns={cols} /> },
        { key: "completed", label: lang === "en" ? "Completed" : "Imekamilika", render: () => <DataTable data={localizedRuns.filter(p=>p.status==="Completed")} columns={cols} /> },
        { key: "rejected",  label: lang === "en" ? "Rejected" : "Imekataliwa",  render: () => <DataTable data={localizedRuns.filter(p=>p.status==="Rejected")} columns={cols} /> },
      ]} />
    </div>
  );
}
