import { createFileRoute } from "@tanstack/react-router";
import { PageHeader } from "@/components/erp/PageHeader";
import { TabbedPage } from "@/components/erp/TabbedPage";
import { DataTable } from "@/components/erp/DataTable";
import { StatusPill } from "@/components/erp/StatusPill";
import { ExportMenu } from "@/components/erp/ExportMenu";
import { useTranslate } from "@/lib/i18n";

export const Route = createFileRoute("/_app/hr/leave")({
  head: () => ({ meta: [{ title: "Leave — DeveleERP" }] }),
  component: LeavePage,
});

function LeavePage() {
  const { t, lang } = useTranslate();

  const translateLeaveType = (type: string) => {
    if (lang === "en") return type;
    const map: Record<string, string> = {
      Annual: "Mwaka",
      Sick: "Ugonjwa",
      Compassionate: "Kifamilia",
      Maternity: "Uzazi (Mama)",
      Paternity: "Uzazi (Baba)",
      "Annual Leave": "Likizo ya Mwaka",
      "Sick Leave": "Likizo ya Ugonjwa",
      "Maternity Leave": "Likizo ya Uzazi (Mama)",
      "Paternity Leave": "Likizo ya Uzazi (Baba)",
      "Compassionate Leave": "Likizo ya Kifamilia",
    };
    return map[type] || type;
  };

  const requestsData = Array.from({ length: 12 }, (_, i) => ({ 
    id: `LV-${500 + i}`, 
    employee: ["John", "Maria", "David", "Aisha", "Peter"][i % 5], 
    type: ["Annual", "Sick", "Compassionate", "Maternity"][i % 4], 
    from: `2026-06-${String(i + 1).padStart(2, "0")}`, 
    days: 2 + i % 5, 
    status: ["Pending", "Approved", "Rejected"][i % 3] 
  }));

  const leaveTypesData = [
    { code: "AL", name: lang === "en" ? "Annual Leave" : "Likizo ya Mwaka", days: 21 }, 
    { code: "SL", name: lang === "en" ? "Sick Leave" : "Likizo ya Ugonjwa", days: 14 },
    { code: "ML", name: lang === "en" ? "Maternity Leave" : "Likizo ya Uzazi (Mama)", days: 90 }, 
    { code: "PL", name: lang === "en" ? "Paternity Leave" : "Likizo ya Uzazi (Baba)", days: 14 },
    { code: "CL", name: lang === "en" ? "Compassionate Leave" : "Likizo ya Kifamilia", days: 7 },
  ];

  const behalfData = Array.from({ length: 6 }, (_, i) => ({ 
    id: `OBL-${600 + i}`, 
    requester: "Aisha Otieno", 
    employee: ["John", "Maria", "David"][i % 3], 
    type: "Sick", 
    days: 1 + i, 
    status: ["Approved", "Pending"][i % 2] 
  }));

  return (
    <div className="space-y-6">
      <PageHeader 
        title={lang === "en" ? "Leave Management" : "Usimamizi wa Likizo"} 
        description={lang === "en" ? "Leave requests, types, and on-behalf submissions." : "Maombi ya likizo, aina za likizo, na uwasilishaji kwa niaba ya wengine."}
        actions={<ExportMenu />} 
      />
      <TabbedPage tabs={[
        { key: "requests", label: lang === "en" ? "Leave Requests" : "Maombi ya Likizo", render: () => (
          <DataTable data={requestsData} columns={[
            { key: "id", header: lang === "en" ? "Request #" : "Ombi #" }, 
            { key: "employee", header: lang === "en" ? "Employee" : "Mfanyakazi" }, 
            { key: "type", header: lang === "en" ? "Type" : "Aina", render: (r) => translateLeaveType(r.type) },
            { key: "from", header: lang === "en" ? "From" : "Kutoka" }, 
            { key: "days", header: lang === "en" ? "Days" : "Siku", align: "right" },
            { key: "status", header: lang === "en" ? "Status" : "Hali", render: (r) => <StatusPill status={r.status} /> }
          ]} />
        )},
        { key: "types", label: lang === "en" ? "Leave Types" : "Aina za Likizo", render: () => (
          <DataTable data={leaveTypesData} columns={[
            { key: "code", header: lang === "en" ? "Code" : "Msimbo" }, 
            { key: "name", header: lang === "en" ? "Type" : "Aina" }, 
            { key: "days", header: lang === "en" ? "Days/Year" : "Siku/Mwaka", align: "right" }
          ]} />
        )},
        { key: "behalf", label: lang === "en" ? "On Behalf Requests" : "Maombi kwa Niaba ya Wengine", render: () => (
          <DataTable data={behalfData} columns={[
            { key: "id", header: lang === "en" ? "Request #" : "Ombi #" }, 
            { key: "requester", header: lang === "en" ? "Filed By" : "Imeandikishwa Na" }, 
            { key: "employee", header: lang === "en" ? "For" : "Kwa Niaba Ya" },
            { key: "type", header: lang === "en" ? "Type" : "Aina", render: (r) => translateLeaveType(r.type) }, 
            { key: "days", header: lang === "en" ? "Days" : "Siku", align: "right" },
            { key: "status", header: lang === "en" ? "Status" : "Hali", render: (r) => <StatusPill status={r.status} /> }
          ]} />
        )},
      ]} />
    </div>
  );
}
