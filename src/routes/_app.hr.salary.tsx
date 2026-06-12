import { createFileRoute } from "@tanstack/react-router";
import { PageHeader } from "@/components/erp/PageHeader";
import { TabbedPage } from "@/components/erp/TabbedPage";
import { DataTable } from "@/components/erp/DataTable";
import { ExportMenu } from "@/components/erp/ExportMenu";
import { staff, currency } from "@/lib/mock";
import { useTranslate } from "@/lib/i18n";

export const Route = createFileRoute("/_app/hr/salary")({
  head: () => ({ meta: [{ title: "Salary — DeveleERP" }] }),
  component: SalaryPage,
});

function SalaryPage() {
  const { t, lang } = useTranslate();

  const translateRoleLevel = (role: string) => {
    if (lang === "en") return role;
    const map: Record<string, string> = {
      "Senior Manager": "Meneja Mwandamizi",
      "Manager": "Meneja",
      "Senior Officer": "Afisa Mwandamizi",
      "Officer": "Afisa",
      "Assistant": "Msaidizi",
    };
    return map[role] || role;
  };

  const rangesData = [
    { grade: "A1", role: "Senior Manager", min: 5500 * 1000, max: 8500 * 1000 },
    { grade: "A2", role: "Manager", min: 3800 * 1000, max: 5500 * 1000 },
    { grade: "B1", role: "Senior Officer", min: 2500 * 1000, max: 3800 * 1000 },
    { grade: "B2", role: "Officer", min: 1500 * 1000, max: 2500 * 1000 },
    { grade: "C1", role: "Assistant", min: 900 * 1000, max: 1500 * 1000 },
  ];

  const slipsData = staff.slice(0, 15).map((s) => ({ 
    id: `SL-${900 + parseInt(s.id.slice(-2))}`, 
    employee: s.name, 
    period: lang === "en" ? "May 2026" : "Mei 2026", 
    gross: s.salary * 1000, 
    deductions: s.salary * 1000 * 0.18, 
    net: s.salary * 1000 * 0.82 
  }));

  return (
    <div className="space-y-6">
      <PageHeader 
        title={lang === "en" ? "Salary" : "Mshahara"} 
        description={lang === "en" ? "Salary ranges and individual payslips." : "Miwango ya mishahara na stakabadhi za malipo ya wafanyakazi."}
        actions={<ExportMenu />} 
      />
      <TabbedPage tabs={[
        { key: "range", label: lang === "en" ? "Salary Ranges" : "Miwango ya Mishahara", render: () => (
          <DataTable data={rangesData} columns={[
            { key: "grade", header: lang === "en" ? "Grade" : "Daraja" }, 
            { key: "role", header: lang === "en" ? "Role Level" : "Ngazi ya Wajibu", render: (r) => translateRoleLevel(r.role) },
            { key: "min", header: lang === "en" ? "Min" : "Chini", align: "right", render: (r) => currency(r.min) },
            { key: "max", header: lang === "en" ? "Max" : "Juu", align: "right", render: (r) => currency(r.max) }
          ]} />
        )},
        { key: "slips", label: lang === "en" ? "Salary Slips" : "Stakabadhi za Mishahara", render: () => (
          <DataTable data={slipsData}
            columns={[
              { key: "id", header: lang === "en" ? "Slip #" : "Stakabadhi #" }, 
              { key: "employee", header: lang === "en" ? "Employee" : "Mfanyakazi" }, 
              { key: "period", header: lang === "en" ? "Period" : "Kipindi" },
              { key: "gross", header: lang === "en" ? "Gross" : "Ghafi", align: "right", render: (r) => currency(r.gross) },
              { key: "deductions", header: lang === "en" ? "Deductions" : "Makato", align: "right", render: (r) => currency(r.deductions) },
              { key: "net", header: lang === "en" ? "Net" : "Halisi", align: "right", render: (r) => currency(r.net) }
            ]} 
          />
        )},
      ]} />
    </div>
  );
}
