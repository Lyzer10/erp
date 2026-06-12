import { createFileRoute } from "@tanstack/react-router";
import { PageHeader } from "@/components/erp/PageHeader";
import { TabbedPage } from "@/components/erp/TabbedPage";
import { DataTable } from "@/components/erp/DataTable";
import { StatusPill } from "@/components/erp/StatusPill";
import { GlassCard } from "@/components/erp/GlassCard";
import { ExportMenu } from "@/components/erp/ExportMenu";
import { staff, currency } from "@/lib/mock";
import { Plus, Upload } from "lucide-react";
import { useTranslate } from "@/lib/i18n";

export const Route = createFileRoute("/_app/hr/staff")({
  head: () => ({ meta: [{ title: "Staff — DeveleERP" }] }),
  component: StaffPage,
});

function StaffPage() {
  const { t, lang } = useTranslate();

  const translateDept = (dept: string) => {
    if (lang === "en") return dept;
    const map: Record<string, string> = {
      IT: "TEHAMA",
      Sales: "Mauzo",
      Finance: "Fedha",
      HR: "Rasilimali Watu",
      Operations: "Uendeshaji",
      Warehouse: "Ghala",
    };
    return map[dept] || dept;
  };

  const translateRole = (role: string) => {
    if (lang === "en") return role;
    const map: Record<string, string> = {
      Admin: "Utawala",
      Manager: "Meneja",
      Cashier: "Mweka Hazina",
      Accountant: "Mhasibu",
      Specialist: "Mtaalamu",
    };
    return map[role] || role;
  };

  const attendanceData = staff.slice(0, 12).map((s) => ({ 
    id: s.id, 
    name: s.name, 
    checkin: "08:12", 
    checkout: "17:05", 
    hours: 8.9, 
    status: lang === "en" ? "Present" : "Yupo" 
  }));

  const localStaff = staff.map(s => ({
    ...s,
    salary: s.salary * 1000 // TZS realistic
  }));

  return (
    <div className="space-y-6">
      <PageHeader 
        title={lang === "en" ? "Staff" : "Wafanyakazi"} 
        description={lang === "en" ? "Employee directory, attendance, and bulk uploads." : "Orodha ya wafanyakazi, mahudhurio, na kupakia kumbukumbu kwa pamoja."}
        actions={
          <div className="flex items-center gap-2">
            <ExportMenu />
            <button className="inline-flex items-center gap-2 rounded-lg bg-blue-500 px-4 py-2 text-sm font-semibold text-white shadow-md hover:bg-blue-600 transition">
              <Plus className="h-4 w-4" />
              {lang === "en" ? "Add Staff" : "Ongeza Mfanyakazi"}
            </button>
          </div>
        } 
      />
      <TabbedPage tabs={[
        { key: "list", label: lang === "en" ? "Staff List" : "Orodha ya Wafanyakazi", render: () => (
          <DataTable data={localStaff} columns={[
            { key: "id", header: "ID" }, 
            { key: "name", header: lang === "en" ? "Name" : "Jina" },
            { key: "department", header: lang === "en" ? "Department" : "Idara", render: (r) => translateDept(r.department) }, 
            { key: "role", header: lang === "en" ? "Role" : "Wajibu", render: (r) => translateRole(r.role) },
            { key: "salary", header: lang === "en" ? "Salary" : "Mshahara", align: "right", render: (r) => currency(r.salary) },
            { key: "joined", header: lang === "en" ? "Joined" : "Alijiunga" },
            { key: "status", header: lang === "en" ? "Status" : "Hali", render: (r) => <StatusPill status={r.status} /> },
          ]} />
        )},
        { key: "attendance", label: lang === "en" ? "Attendance" : "Mahudhurio", render: () => (
          <DataTable data={attendanceData}
            columns={[
              { key: "id", header: "ID" }, 
              { key: "name", header: lang === "en" ? "Employee" : "Mfanyakazi" },
              { key: "checkin", header: lang === "en" ? "Check-in" : "Muda wa Kuingia" }, 
              { key: "checkout", header: lang === "en" ? "Check-out" : "Muda wa Kutoka" },
              { key: "hours", header: lang === "en" ? "Hours" : "Saa", align: "right" }, 
              { key: "status", header: lang === "en" ? "Status" : "Hali" }
            ]} 
          />
        )},
        { key: "upload", label: lang === "en" ? "Upload Staff" : "Pakia Wafanyakazi", render: () => (
          <GlassCard>
            <div className="rounded-2xl border-2 border-dashed border-slate-200 bg-slate-50 p-12 text-center">
              <Upload className="mx-auto h-10 w-10 text-blue-500" />
              <h3 className="mt-3 text-base font-semibold">{lang === "en" ? "Bulk upload staff records" : "Pakia kumbukumbu za wafanyakazi kwa pamoja"}</h3>
              <p className="mt-1 text-sm text-muted-foreground">
                {lang === "en" ? "Drag a CSV or Excel file here, or click to browse." : "Buruta faili la CSV au Excel hapa, au bonyeza ili kutafuta."}
              </p>
            </div>
          </GlassCard>
        )},
      ]} />
    </div>
  );
}
