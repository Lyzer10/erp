import { createFileRoute } from "@tanstack/react-router";
import { PageHeader } from "@/components/erp/PageHeader";
import { TabbedPage } from "@/components/erp/TabbedPage";
import { GlassCard } from "@/components/erp/GlassCard";
import { DataTable } from "@/components/erp/DataTable";
import { EChart } from "@/components/charts/EChart";
import { ExportMenu } from "@/components/erp/ExportMenu";
import { currency } from "@/lib/mock";
import { useTranslate } from "@/lib/i18n";

export const Route = createFileRoute("/_app/finance/reports")({
  head: () => ({ meta: [{ title: "Financial Reports — DeveleERP" }] }),
  component: ReportsPage,
});

function ReportsPage() {
  const { t, lang } = useTranslate();

  const getPnl = () => [
    { item: lang === "en" ? "Revenue" : "Mapato", amount: 284350 * 1000 }, 
    { item: lang === "en" ? "Cost of Goods Sold" : "Gharama ya Bidhaa Zilizouzwa", amount: -142180 * 1000 },
    { item: lang === "en" ? "Gross Profit" : "Faida Ghafi", amount: 142170 * 1000 }, 
    { item: lang === "en" ? "Operating Expenses" : "Gharama za Uendeshaji", amount: -68420 * 1000 },
    { item: lang === "en" ? "Operating Profit" : "Faida ya Uendeshaji", amount: 73750 * 1000 }, 
    { item: lang === "en" ? "Tax" : "Kodi", amount: -22125 * 1000 },
    { item: lang === "en" ? "Net Profit" : "Faida Halisi", amount: 51625 * 1000 },
  ];

  const pnl = getPnl();

  const getTrialAccounts = (account: string) => {
    if (lang === "en") return account;
    const map: Record<string, string> = {
      Cash: "Fedha Taslimu",
      Bank: "Benki",
      Sales: "Mauzo",
      Receivables: "Madai ya Wateja",
      Payables: "Madeni ya Wauzaji",
      Expenses: "Matumizi",
      Salaries: "Mishahara",
      Inventory: "Bidhaa za Stoo",
    };
    return map[account] || account;
  };

  const trialData = ["Cash","Bank","Sales","Receivables","Payables","Expenses","Salaries","Inventory"].map((a, i) => ({ 
    account: getTrialAccounts(a), 
    dr: i % 2 ? 0 : (5000 + i * 800) * 1000, 
    cr: i % 2 ? (4000 + i * 700) * 1000 : 0 
  }));

  const cashBookData = Array.from({ length: 12 }, (_, i) => {
    const originalDesc = ["Sale", "Purchase", "Payroll", "Transfer", "Expense"][i % 5];
    const desc = lang === "en" 
      ? originalDesc 
      : originalDesc
          .replace("Sale", "Mauzo")
          .replace("Purchase", "Ununuzi")
          .replace("Payroll", "Mishahara")
          .replace("Transfer", "Uhamisho")
          .replace("Expense", "Matumizi");

    return { 
      date: `2026-06-${String(i + 1).padStart(2, "0")}`, 
      desc, 
      dr: i % 2 ? 0 : (1200 + i * 80) * 1000, 
      cr: i % 2 ? (900 + i * 70) * 1000 : 0, 
      bal: (5000 + i * 120) * 1000 
    };
  });

  const vendorData = Array.from({ length: 10 }, (_, i) => ({ 
    id: `V-${i + 1}`, 
    name: lang === "en" ? `Vendor ${i + 1}` : `Muuzaji ${i + 1}`, 
    bills: 4 + i, 
    paid: (1200 + i * 400) * 1000, 
    due: (600 + i * 150) * 1000 
  }));

  const paymentsData = Array.from({ length: 12 }, (_, i) => {
    const originalMethod = ["Cash", "Bank", "Mobile"][i % 3];
    const method = lang === "en"
      ? originalMethod
      : originalMethod.replace("Cash", "Taslimu").replace("Bank", "Benki").replace("Mobile", "Mtandao");

    return { 
      id: `PMT-${500 + i}`, 
      ref: `INV-${5000 + i}`, 
      date: `2026-06-${String(i + 1).padStart(2, "0")}`, 
      method, 
      amount: (800 + i * 120) * 1000 
    };
  });

  const getAssetsData = () => [
    { a: lang === "en" ? "Cash" : "Fedha Taslimu", v: 24500 * 1000 }, 
    { a: lang === "en" ? "Bank" : "Benki", v: 86300 * 1000 }, 
    { a: lang === "en" ? "Receivables" : "Madai ya Wateja", v: 42100 * 1000 }, 
    { a: lang === "en" ? "Inventory" : "Bidhaa Stoo", v: 96400 * 1000 }, 
    { a: lang === "en" ? "Equipment" : "Vifaa", v: 38200 * 1000 }
  ];

  const getLiabilitiesData = () => [
    { a: lang === "en" ? "Payables" : "Madeni ya Wauzaji", v: 32600 * 1000 }, 
    { a: lang === "en" ? "Loans" : "Mikopo", v: 48000 * 1000 }, 
    { a: lang === "en" ? "Equity" : "Ekwiti / Mtaji", v: 124700 * 1000 }, 
    { a: lang === "en" ? "Retained Earnings" : "Mapato Yaliyolimbikizwa", v: 82200 * 1000 }
  ];

  return (
    <div className="space-y-6">
      <PageHeader 
        title={lang === "en" ? "Financial Reports" : "Ripoti za Kifedha"} 
        description={lang === "en" ? "P&L, Cash Book, Trial Balance, Balance Sheet, and more." : "P&L, Kitabu cha Taslimu, Ulinganisho wa Majaribio, Mizania, na zaidi."}
        actions={<ExportMenu />} 
      />
      <TabbedPage tabs={[
        { key: "pnl", label: lang === "en" ? "Gross P&L" : "P&L Ghafi", render: () => (
          <div className="grid gap-6 lg:grid-cols-2">
            <DataTable searchable={false} pageSize={20} data={pnl} columns={[
              { key: "item", header: lang === "en" ? "Line" : "Mstari" },
              { key: "amount", header: lang === "en" ? "Amount" : "Kiasi", align: "right", render: (r) => <span className={r.amount < 0 ? "text-rose-600" : "font-semibold"}>{currency(r.amount)}</span> },
            ]} />
            <GlassCard>
              <EChart height={300} option={{
                tooltip: { trigger: "axis", confine: true },
              xAxis: { 
                  type: "category", 
                  data: lang === "en" 
                    ? ["Revenue","COGS","Gross","OpEx","Operating","Tax","Net"] 
                    : ["Mapato","COGS","Ghafi","OpEx","Uendeshaji","Kodi","Halisi"] 
                },
                yAxis: { type: "value" },
                series: [{ type: "bar", data: pnl.map(p => Math.abs(p.amount)), itemStyle: { borderRadius: [6,6,0,0] }, barWidth: 24 }],
              }} />
            </GlassCard>
          </div>
        )},
        { key: "cash", label: lang === "en" ? "Cash Book" : "Kitabu cha Taslimu", render: () => (
          <DataTable data={cashBookData}
            columns={[
              { key: "date", header: lang === "en" ? "Date" : "Tarehe" }, 
              { key: "desc", header: lang === "en" ? "Description" : "Maelezo" },
              { key: "dr", header: "DR", align: "right", render: (r) => r.dr ? currency(r.dr) : "—" },
              { key: "cr", header: "CR", align: "right", render: (r) => r.cr ? currency(r.cr) : "—" },
              { key: "bal", header: lang === "en" ? "Balance" : "Salio", align: "right", render: (r) => currency(r.bal) },
            ]} />
        )},
        { key: "income", label: lang === "en" ? "Income Statement" : "Taarifa ya Mapato", render: () => <DataTable searchable={false} data={pnl} columns={[{ key: "item", header: lang === "en" ? "Item" : "Kipengele" }, { key: "amount", header: lang === "en" ? "Amount" : "Kiasi", align: "right", render: (r) => currency(r.amount) }]} /> },
        { key: "trial", label: lang === "en" ? "Trial Balance" : "Ulinganisho wa Majaribio (Trial Balance)", render: () => (
          <DataTable data={trialData}
            columns={[
              { key: "account", header: lang === "en" ? "Account" : "Akaunti" },
              { key: "dr", header: lang === "en" ? "Debit" : "Deni", align: "right", render: (r) => r.dr ? currency(r.dr) : "—" },
              { key: "cr", header: lang === "en" ? "Credit" : "Mkopo", align: "right", render: (r) => r.cr ? currency(r.cr) : "—" }
            ]} 
          />
        )},
        { key: "bs", label: lang === "en" ? "Balance Sheet" : "Mizania (Balance Sheet)", render: () => (
          <div className="grid gap-6 lg:grid-cols-2">
            <GlassCard>
              <h2 className="mb-3 font-semibold text-base text-slate-800">{lang === "en" ? "Assets" : "Rasilimali"}</h2>
              <DataTable searchable={false} pageSize={20} data={getAssetsData()} columns={[{ key: "a", header: lang === "en" ? "Item" : "Kipengele" }, { key: "v", header: lang === "en" ? "Amount" : "Kiasi", align: "right", render: (r) => currency(r.v) }]} />
            </GlassCard>
            <GlassCard>
              <h2 className="mb-3 font-semibold text-base text-slate-800">{lang === "en" ? "Liabilities & Equity" : "Dhima na Ekwiti"}</h2>
              <DataTable searchable={false} pageSize={20} data={getLiabilitiesData()} columns={[{ key: "a", header: lang === "en" ? "Item" : "Kipengele" }, { key: "v", header: lang === "en" ? "Amount" : "Kiasi", align: "right", render: (r) => currency(r.v) }]} />
            </GlassCard>
          </div>
        )},
        { key: "vendor", label: lang === "en" ? "Vendor Reports" : "Ripoti za Wauzaji", render: () => (
          <DataTable data={vendorData}
            columns={[
              { key: "id", header: "ID" }, 
              { key: "name", header: lang === "en" ? "Vendor" : "Muuzaji" },
              { key: "bills", header: lang === "en" ? "Bills" : "Bili", align: "right" },
              { key: "paid", header: lang === "en" ? "Paid" : "Imelipwa", align: "right", render: (r) => currency(r.paid) },
              { key: "due", header: lang === "en" ? "Due" : "Inadaiwa", align: "right", render: (r) => currency(r.due) },
            ]} 
          />
        )},
        { key: "payments", label: lang === "en" ? "Payments" : "Malipo", render: () => (
          <DataTable data={paymentsData}
            columns={[
              { key: "id", header: lang === "en" ? "Payment #" : "Malipo #" }, 
              { key: "ref", header: lang === "en" ? "Ref" : "Kumbukumbu" }, 
              { key: "date", header: lang === "en" ? "Date" : "Tarehe" },
              { key: "method", header: lang === "en" ? "Method" : "Njia ya Malipo" },
              { key: "amount", header: lang === "en" ? "Amount" : "Kiasi", align: "right", render: (r) => currency(r.amount) },
            ]} 
          />
        )},
        { key: "stock", label: lang === "en" ? "Stock Valuation" : "Kuhimili Thamani ya Bidhaa", render: () => (
          <GlassCard>
            <EChart height={320} option={{
              tooltip: { trigger: "axis", confine: true },
              xAxis: { 
                type: "category", 
                data: lang === "en" 
                  ? ["Beverages","Groceries","Electronics","Stationery","Household"] 
                  : ["Vinywaji","Chakula na Bidhaa za Nyumbani","Vifaa vya Umeme","Vifaa vya Ofisi","Vifaa vya Nyumbani"] 
              },
              yAxis: { type: "value" },
              series: [{ type: "bar", data: [42000, 28000, 51000, 12000, 19000], itemStyle: { borderRadius: [6,6,0,0], color: "#10b981" }, barWidth: 32 }],
            }} />
          </GlassCard>
        )},
      ]} />
    </div>
  );
}
