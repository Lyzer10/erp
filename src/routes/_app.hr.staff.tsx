import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { PageHeader } from "@/components/erp/PageHeader";
import { TabbedPage } from "@/components/erp/TabbedPage";
import { DataTable } from "@/components/erp/DataTable";
import { StatusPill } from "@/components/erp/StatusPill";
import { GlassCard } from "@/components/erp/GlassCard";
import { ExportMenu } from "@/components/erp/ExportMenu";
import { staff, currency } from "@/lib/mock";
import { Plus, Upload } from "lucide-react";
import { useTranslate } from "@/lib/i18n";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

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

  const baseStaff = staff.map(s => ({
    ...s,
    salary: s.salary * 1000 // TZS realistic
  }));

  const [localStaffList, setLocalStaffList] = useState(baseStaff);

  // Add Staff Modal State
  const [addOpen, setAddOpen] = useState(false);
  const [name, setName] = useState("");
  const [department, setDepartment] = useState("IT");
  const [role, setRole] = useState("Specialist");
  const [salary, setSalary] = useState(1200000);
  const [joined, setJoined] = useState("2026-06-12");

  // Statutory Parameters States
  const [isPaye, setIsPaye] = useState(true);
  const [isNssf, setIsNssf] = useState(true);
  const [isWcf, setIsWcf] = useState(true);
  const [isNhif, setIsNhif] = useState(true);
  const [isSdl, setIsSdl] = useState(true);
  const [isLoanBoard, setIsLoanBoard] = useState(false);

  // Emergency contact details states
  const [relativeName, setRelativeName] = useState("");
  const [relativeRelation, setRelativeRelation] = useState("");
  const [relativePhone, setRelativePhone] = useState("");

  // Financial Deductions states
  const [loanDeduction, setLoanDeduction] = useState(0);
  const [lossDeduction, setLossDeduction] = useState(0);

  const handleAddStaff = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name) return;

    const newStaff = {
      id: `EMP-${100 + localStaffList.length + 1}`,
      name,
      department,
      role,
      salary,
      joined,
      status: "Active" as const,
      isPaye,
      isNssf,
      isWcf,
      isNhif,
      isSdl,
      isLoanBoard,
      relativeName,
      relativeRelation,
      relativePhone,
      loanDeduction,
      lossDeduction
    };

    setLocalStaffList(prev => [...prev, newStaff]);
    setAddOpen(false);

    // Reset Form
    setName("");
    setDepartment("IT");
    setRole("Specialist");
    setSalary(1200000);
    setJoined("2026-06-12");
    setIsPaye(true);
    setIsNssf(true);
    setIsWcf(true);
    setIsNhif(true);
    setIsSdl(true);
    setIsLoanBoard(false);
    setRelativeName("");
    setRelativeRelation("");
    setRelativePhone("");
    setLoanDeduction(0);
    setLossDeduction(0);
  };

  return (
    <div className="space-y-6">
      <PageHeader 
        title={lang === "en" ? "Staff" : "Wafanyakazi"} 
        description={lang === "en" ? "Employee directory, attendance, and bulk uploads." : "Orodha ya wafanyakazi, mahudhurio, na kupakia kumbukumbu kwa pamoja."}
        actions={
          <div className="flex items-center gap-2">
            <ExportMenu />
            <button
              onClick={() => setAddOpen(true)}
              className="inline-flex items-center gap-2 rounded-lg bg-blue-500 px-4 py-2 text-sm font-semibold text-white shadow-md hover:bg-blue-600 transition cursor-pointer"
            >
              <Plus className="h-4 w-4" />
              {lang === "en" ? "Add Staff" : "Ongeza Mfanyakazi"}
            </button>
          </div>
        } 
      />
      <TabbedPage tabs={[
        { key: "list", label: lang === "en" ? "Staff List" : "Orodha ya Wafanyakazi", render: () => (
          <DataTable data={localStaffList} columns={[
            { key: "id", header: "ID" }, 
            { key: "name", header: lang === "en" ? "Name" : "Jina" },
            { key: "department", header: lang === "en" ? "Department" : "Idara", render: (r: any) => translateDept(r.department) }, 
            { key: "role", header: lang === "en" ? "Role" : "Wajibu", render: (r: any) => translateRole(r.role) },
            { key: "salary", header: lang === "en" ? "Salary" : "Mshahara", align: "right", render: (r: any) => currency(r.salary) },
            { key: "joined", header: lang === "en" ? "Joined" : "Alijiunga" },
            { key: "status", header: lang === "en" ? "Status" : "Hali", render: (r: any) => <StatusPill status={r.status} /> },
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

      {/* Add Staff Modal */}
      <Dialog open={addOpen} onOpenChange={setAddOpen}>
        <DialogContent className="max-w-2xl max-h-[85vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-base font-bold">
              {lang === "en" ? "Add New Staff Member" : "Ongeza Mfanyakazi Mpya"}
            </DialogTitle>
          </DialogHeader>
          <form onSubmit={handleAddStaff} className="space-y-4 text-sm mt-2">
            
            {/* Primary Details */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-600 mb-1.5">
                  {lang === "en" ? "Full Name" : "Jina Kamili"}
                </label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full rounded-lg border border-slate-200 p-2 outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-600 mb-1.5">
                  {lang === "en" ? "Salary (Monthly TZS)" : "Mshahara (Kila Mwezi TZS)"}
                </label>
                <input
                  type="number"
                  required
                  value={salary}
                  onChange={(e) => setSalary(Number(e.target.value))}
                  className="w-full rounded-lg border border-slate-200 p-2 outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                />
              </div>
            </div>

            <div className="grid grid-cols-3 gap-3">
              <div>
                <label className="block text-xs font-semibold text-slate-600 mb-1.5">
                  {lang === "en" ? "Department" : "Idara"}
                </label>
                <select
                  value={department}
                  onChange={(e) => setDepartment(e.target.value)}
                  className="w-full rounded-lg border border-slate-200 p-2 outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                >
                  <option value="IT">IT (TEHAMA)</option>
                  <option value="Sales">Sales (Mauzo)</option>
                  <option value="Finance">Finance (Fedha)</option>
                  <option value="HR">HR (Rasilimali Watu)</option>
                  <option value="Operations">Operations (Uendeshaji)</option>
                  <option value="Warehouse">Warehouse (Ghala)</option>
                </select>
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-600 mb-1.5">
                  {lang === "en" ? "Job Role" : "Wajibu wa Kazi"}
                </label>
                <select
                  value={role}
                  onChange={(e) => setRole(e.target.value)}
                  className="w-full rounded-lg border border-slate-200 p-2 outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                >
                  <option value="Admin">Admin (Utawala)</option>
                  <option value="Manager">Manager (Meneja)</option>
                  <option value="Cashier">Cashier (Mweka Hazina)</option>
                  <option value="Accountant">Accountant (Mhasibu)</option>
                  <option value="Specialist">Specialist (Mtaalamu)</option>
                </select>
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-600 mb-1.5">
                  {lang === "en" ? "Joining Date" : "Tarehe ya Kujiunga"}
                </label>
                <input
                  type="date"
                  value={joined}
                  onChange={(e) => setJoined(e.target.value)}
                  className="w-full rounded-lg border border-slate-200 p-2 outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                />
              </div>
            </div>

            {/* Statutory Parameters Checkbox Matrix */}
            <div className="border-t border-slate-100 pt-3">
              <span className="block text-xs font-bold text-slate-700 mb-2">
                {lang === "en" ? "Statutory Deductions & Insurances" : "Makato ya Kisheria na Bima"}
              </span>
              <div className="grid grid-cols-3 gap-3">
                <label className="flex items-center gap-2 text-xs text-slate-600 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={isPaye}
                    onChange={(e) => setIsPaye(e.target.checked)}
                    className="rounded border-slate-300 text-blue-600 focus:ring-blue-500"
                  />
                  PAYE Tax
                </label>
                <label className="flex items-center gap-2 text-xs text-slate-600 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={isNssf}
                    onChange={(e) => setIsNssf(e.target.checked)}
                    className="rounded border-slate-300 text-blue-600 focus:ring-blue-500"
                  />
                  NSSF Pension
                </label>
                <label className="flex items-center gap-2 text-xs text-slate-600 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={isWcf}
                    onChange={(e) => setIsWcf(e.target.checked)}
                    className="rounded border-slate-300 text-blue-600 focus:ring-blue-500"
                  />
                  WCF Compensation
                </label>
                <label className="flex items-center gap-2 text-xs text-slate-600 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={isNhif}
                    onChange={(e) => setIsNhif(e.target.checked)}
                    className="rounded border-slate-300 text-blue-600 focus:ring-blue-500"
                  />
                  NHIF Health Insurance
                </label>
                <label className="flex items-center gap-2 text-xs text-slate-600 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={isSdl}
                    onChange={(e) => setIsSdl(e.target.checked)}
                    className="rounded border-slate-300 text-blue-600 focus:ring-blue-500"
                  />
                  SDL Skills Levy
                </label>
                <label className="flex items-center gap-2 text-xs text-slate-600 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={isLoanBoard}
                    onChange={(e) => setIsLoanBoard(e.target.checked)}
                    className="rounded border-slate-300 text-blue-600 focus:ring-blue-500"
                  />
                  HESLB Loan Board
                </label>
              </div>
            </div>

            {/* Emergency Contact */}
            <div className="border-t border-slate-100 pt-3">
              <span className="block text-xs font-bold text-slate-700 mb-2">
                {lang === "en" ? "Emergency Relative Details" : "Taarifa za Ndugu wa Dharura"}
              </span>
              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-600 mb-1.5">
                    {lang === "en" ? "Relative Name" : "Jina la Ndugu"}
                  </label>
                  <input
                    type="text"
                    value={relativeName}
                    onChange={(e) => setRelativeName(e.target.value)}
                    className="w-full rounded-lg border border-slate-200 p-2 outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-600 mb-1.5">
                    {lang === "en" ? "Relationship" : "Uhusiano"}
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Spouse / Brother"
                    value={relativeRelation}
                    onChange={(e) => setRelativeRelation(e.target.value)}
                    className="w-full rounded-lg border border-slate-200 p-2 outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-600 mb-1.5">
                    {lang === "en" ? "Phone Number" : "Nambari ya Simu"}
                  </label>
                  <input
                    type="tel"
                    value={relativePhone}
                    onChange={(e) => setRelativePhone(e.target.value)}
                    className="w-full rounded-lg border border-slate-200 p-2 outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                  />
                </div>
              </div>
            </div>

            {/* Custom Deductions */}
            <div className="border-t border-slate-100 pt-3">
              <span className="block text-xs font-bold text-slate-700 mb-2">
                {lang === "en" ? "Custom Loan & Deductions" : "Mikopo na Makato Maalum"}
              </span>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-600 mb-1.5">
                    {lang === "en" ? "Loan Deduction (TZS)" : "Makato ya Mkopo (TZS)"}
                  </label>
                  <input
                    type="number"
                    value={loanDeduction}
                    onChange={(e) => setLoanDeduction(Number(e.target.value))}
                    className="w-full rounded-lg border border-slate-200 p-2 outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-600 mb-1.5">
                    {lang === "en" ? "Loss Offset (TZS)" : "Fidia ya Hasara (TZS)"}
                  </label>
                  <input
                    type="number"
                    value={lossDeduction}
                    onChange={(e) => setLossDeduction(Number(e.target.value))}
                    className="w-full rounded-lg border border-slate-200 p-2 outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                  />
                </div>
              </div>
            </div>

            <div className="flex justify-end gap-2 border-t border-slate-100 pt-3">
              <button
                type="button"
                onClick={() => setAddOpen(false)}
                className="rounded-lg border border-slate-200 px-4 py-2 text-xs font-semibold hover:bg-slate-50 cursor-pointer"
              >
                {lang === "en" ? "Cancel" : "Ghairi"}
              </button>
              <button
                type="submit"
                className="rounded-lg bg-blue-500 px-4 py-2 text-xs font-semibold text-white hover:bg-blue-600 cursor-pointer"
              >
                {lang === "en" ? "Submit Staff" : "Wasilisha Mfanyakazi"}
              </button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
