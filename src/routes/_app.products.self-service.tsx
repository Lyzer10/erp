import { createFileRoute } from "@tanstack/react-router";
import { PageHeader } from "@/components/erp/PageHeader";
import { TabbedPage } from "@/components/erp/TabbedPage";
import { DataTable } from "@/components/erp/DataTable";
import { StatusPill } from "@/components/erp/StatusPill";
import { ExportMenu } from "@/components/erp/ExportMenu";
import { currency } from "@/lib/mock";
import { useTranslate } from "@/lib/i18n";

export const Route = createFileRoute("/_app/products/self-service")({
  head: () => ({ meta: [{ title: "Employee Self Service — DeveleERP" }] }),
  component: SelfServicePage,
});

function SelfServicePage() {
  const { t, lang } = useTranslate();

  const getPurpose = (purpose: string) => {
    if (lang === "en") return purpose;
    const map: Record<string, string> = {
      Travel: "Safari",
      Equipment: "Vifaa",
      Reimbursement: "Rejesho la Fedha",
      Training: "Mafunzo",
    };
    return map[purpose] || purpose;
  };

  const getLeaveType = (type: string) => {
    if (lang === "en") return type;
    const map: Record<string, string> = {
      Annual: "Mwaka",
      Sick: "Ugonjwa",
      Compassionate: "Kifamilia",
    };
    return map[type] || type;
  };

  const paymentsData = Array.from({ length: 8 }, (_, i) => ({ 
    id: `PR-${200 + i}`, 
    requester: ["John", "Maria", "David", "Aisha"][i % 4], 
    purpose: ["Travel", "Equipment", "Reimbursement", "Training"][i % 4], 
    amount: (250 + i * 120) * 1000, 
    status: ["Pending", "Approved", "Rejected"][i % 3] 
  }));

  const leaveData = Array.from({ length: 8 }, (_, i) => ({ 
    id: `LV-${300 + i}`, 
    employee: ["John", "Maria", "David", "Aisha"][i % 4], 
    type: ["Annual", "Sick", "Compassionate"][i % 3], 
    days: 2 + i, 
    status: ["Pending", "Approved", "Rejected"][i % 3] 
  }));

  const slipsData = Array.from({ length: 8 }, (_, i) => ({ 
    id: `SL-${400 + i}`, 
    period: lang === "en" ? "May 2026" : "Mei 2026", 
    employee: ["John", "Maria", "David", "Aisha"][i % 4], 
    gross: (1800 + i * 120) * 1000, 
    net: (1500 + i * 100) * 1000 
  }));

  return (
    <div className="space-y-6">
      <PageHeader 
        title={lang === "en" ? "Employee Self Service" : "Huduma ya Wafanyakazi"} 
        description={lang === "en" ? "Request payments, leave, and view payslips." : "Omba malipo, likizo, na uangalie stakabadhi za mishahara."}
        actions={<ExportMenu />} 
      />
      <TabbedPage tabs={[
        { key: "payments", label: lang === "en" ? "Request Payments" : "Omba Malipo", render: () => (
          <DataTable data={paymentsData} columns={[
            { key: "id", header: lang === "en" ? "Request #" : "Ombi #" }, 
            { key: "requester", header: lang === "en" ? "Requester" : "Mwombaji" },
            { key: "purpose", header: lang === "en" ? "Purpose" : "Madhumuni", render: (r) => getPurpose(r.purpose) },
            { key: "amount", header: lang === "en" ? "Amount" : "Kiasi", align: "right", render: (r) => currency(r.amount) },
            { key: "status", header: lang === "en" ? "Status" : "Hali", render: (r) => <StatusPill status={r.status} /> },
          ]} />
        )},
        { key: "leave", label: lang === "en" ? "Request Leave" : "Omba Likizo", render: () => (
          <DataTable data={leaveData} columns={[
            { key: "id", header: lang === "en" ? "Leave #" : "Likizo #" }, 
            { key: "employee", header: lang === "en" ? "Employee" : "Mfanyakazi" },
            { key: "type", header: lang === "en" ? "Type" : "Aina", render: (r) => getLeaveType(r.type) }, 
            { key: "days", header: lang === "en" ? "Days" : "Siku", align: "right" },
            { key: "status", header: lang === "en" ? "Status" : "Hali", render: (r) => <StatusPill status={r.status} /> },
          ]} />
        )},
        { key: "slip", label: lang === "en" ? "Salary Slips" : "Stakabadhi za Mishahara", render: () => (
          <DataTable data={slipsData} columns={[
            { key: "id", header: lang === "en" ? "Slip #" : "Stakabadhi #" }, 
            { key: "employee", header: lang === "en" ? "Employee" : "Mfanyakazi" },
            { key: "period", header: lang === "en" ? "Period" : "Kipindi" },
            { key: "gross", header: lang === "en" ? "Gross" : "Ghafi", align: "right", render: (r) => currency(r.gross) },
            { key: "net", header: lang === "en" ? "Net" : "Halisi", align: "right", render: (r) => currency(r.net) },
          ]} />
        )},
      ]} />
    </div>
  );
}
