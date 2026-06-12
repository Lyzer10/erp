import { createFileRoute } from "@tanstack/react-router";
import { PageHeader } from "@/components/erp/PageHeader";
import { TabbedPage } from "@/components/erp/TabbedPage";
import { DataTable } from "@/components/erp/DataTable";
import { StatusPill } from "@/components/erp/StatusPill";
import { GlassCard } from "@/components/erp/GlassCard";
import { ExportMenu } from "@/components/erp/ExportMenu";
import { useTranslate } from "@/lib/i18n";
import { Plus, KeyRound } from "lucide-react";

export const Route = createFileRoute("/_app/admin/users")({
  head: () => ({ meta: [{ title: "Users — DeveleERP" }] }),
  component: UsersPage,
});

function UsersPage() {
  const { t, lang } = useTranslate();

  const translateRole = (role: string) => {
    if (lang === "en") return role;
    const map: Record<string, string> = {
      Admin: "Utawala",
      Manager: "Meneja",
      Cashier: "Mweka Hazina",
      Accountant: "Mhasibu",
    };
    return map[role] || role;
  };

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

  return (
    <div className="space-y-6">
      <PageHeader 
        title={lang === "en" ? "Users & Access" : "Watumiaji na Haki za Kuingia"} 
        description={lang === "en" ? "Manage users, departments, and password resets." : "Simamia watumiaji, idara, na kuweka upya nywila."}
        actions={
          <div className="flex items-center gap-2">
            <ExportMenu />
            <button className="inline-flex items-center gap-2 rounded-lg bg-blue-500 px-4 py-2 text-sm font-semibold text-white shadow-md hover:bg-blue-600 transition">
              <Plus className="h-4 w-4" />
              {lang === "en" ? "Add User" : "Ongeza Mtumiaji"}
            </button>
          </div>
        } 
      />
      <TabbedPage tabs={[
        { key: "users", label: lang === "en" ? "Users List" : "Orodha ya Watumiaji", render: () => (
          <DataTable data={Array.from({length:12},(_,i)=>({ 
            id:`U-${1000+i}`, 
            name:["Aisha Otieno","John Mwangi","Maria Banda","David Kumar"][i%4], 
            email:`user${i}@devele.co`, 
            role:["Admin","Manager","Cashier","Accountant"][i%4], 
            department:["IT","Sales","Finance","HR"][i%4], 
            status:["Active","Active","Inactive"][i%3] 
          }))}
            columns={[
              { key:"id", header:"ID" }, 
              { key:"name", header: lang === "en" ? "Name" : "Jina" }, 
              { key:"email", header: lang === "en" ? "Email" : "Barua Pepe" },
              { key:"role", header: lang === "en" ? "Role" : "Wajibu", render: (r) => translateRole(r.role) }, 
              { key:"department", header: lang === "en" ? "Department" : "Idara", render: (r) => translateDept(r.department) },
              { key:"status", header: lang === "en" ? "Status" : "Hali", render:(r)=><StatusPill status={r.status} /> }
            ]} 
          />
        )},
        { key: "departments", label: lang === "en" ? "Departments" : "Idara", render: () => (
          <DataTable data={["Sales","Finance","HR","Operations","IT","Warehouse"].map((d, i) => ({ 
            code:`DPT-${10+i}`, 
            name:d, 
            head:["Aisha","John","Maria","David","Peter","Grace"][i], 
            members:4+i*2 
          }))}
            columns={[
              { key:"code", header: lang === "en" ? "Code" : "Msimbo" }, 
              { key:"name", header: lang === "en" ? "Department" : "Idara", render: (r) => translateDept(r.name) }, 
              { key:"head", header: lang === "en" ? "Head" : "Mkuu" }, 
              { key:"members", header: lang === "en" ? "Members" : "Wanachama", align:"right" }
            ]} 
          />
        )},
        { key: "reset", label: lang === "en" ? "Reset Password" : "Weka Upya Nywila", render: () => (
          <GlassCard className="max-w-md">
            <div className="grid h-14 w-14 place-items-center rounded-2xl bg-slate-100">
              <KeyRound className="h-6 w-6 text-blue-600" />
            </div>
            <h3 className="mt-3 text-lg font-semibold">{lang === "en" ? "Reset User Password" : "Weka Upya Nywila ya Mtumiaji"}</h3>
            <p className="mt-1 text-sm text-muted-foreground">
              {lang === "en" ? "Select a user and send them a temporary password." : "Chagua mtumiaji na umtumie nywila ya muda."}
            </p>
            <div className="mt-4 space-y-3">
              <select className="w-full rounded-lg border border-white/60 bg-white/60 px-3 py-2 text-sm">
                <option>{lang === "en" ? "Select user..." : "Chagua mtumiaji..."}</option>
                <option>John Mwangi</option>
                <option>Maria Banda</option>
              </select>
              <button className="w-full rounded-lg bg-blue-500 px-4 py-2 text-sm font-semibold text-white shadow-md hover:bg-blue-600 transition">
                {lang === "en" ? "Send Reset Link" : "Tuma Kiungo cha Kuweka Upya"}
              </button>
            </div>
          </GlassCard>
        )},
      ]} />
    </div>
  );
}
