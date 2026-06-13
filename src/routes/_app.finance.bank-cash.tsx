import { createFileRoute } from "@tanstack/react-router";
import { useState, useMemo } from "react";
import { PageHeader } from "@/components/erp/PageHeader";
import { TabbedPage } from "@/components/erp/TabbedPage";
import { ExportMenu } from "@/components/erp/ExportMenu";
import { currency } from "@/lib/mock";
import { useTranslate } from "@/lib/i18n";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Plus, Search, Calendar, Check, X, ShieldAlert, CheckSquare, Square, RefreshCw } from "lucide-react";

export const Route = createFileRoute("/_app/finance/bank-cash")({
  head: () => ({ meta: [{ title: "Bank & Cash — DeveleERP" }] }),
  component: BankCashPage,
});

interface BankAccount {
  id: string;
  bank: string;
  branch: string;
  account: string;
  name: string;
  type: string;
  erpBranch: string;
  balance: number;
  currency: string;
}

interface CashAccount {
  id: string;
  name: string;
  custodian: string;
  balance: number;
}

interface ReconciliationLog {
  id: string;
  date: string;
  reconciledBy: string;
  time: string;
  beginningBalance: number;
  endingBalance: number;
  clearedBalance: number;
  difference: number;
  bankName: string;
}

interface Transaction {
  id: number;
  date: string;
  description: string;
  method: string;
  reference: string;
  payee: string;
  deposits: number;
  payments: number;
  cleared: boolean;
}

function BankCashPage() {
  const { lang, t } = useTranslate();

  // State for Bank Accounts
  const [bankAccounts, setBankAccounts] = useState<BankAccount[]>([
    { id: "BA-01", bank: "KCB", branch: "Nairobi CBD", name: "Aisha Otieno", account: "1234567890", balance: 86320, type: "Current", erpBranch: "Nairobi CBD", currency: "TZS" },
    { id: "BA-02", bank: "Equity", branch: "Westlands", name: "Aisha Otieno", account: "0998877665", balance: 42810, type: "Savings", erpBranch: "Westlands", currency: "TZS" },
    { id: "BA-03", bank: "NCBA", branch: "Mombasa", name: "Aisha Otieno", account: "5544332211", balance: 18420, type: "Current", erpBranch: "Mombasa", currency: "TZS" },
    { id: "BA-04", bank: "NMB", branch: "Depima Technology", name: "DEPIMA TECHNOLOGY", account: "25110057533", balance: 25110057.33, type: "Current", erpBranch: "Head Office", currency: "TZS" },
  ]);

  // State for Cash Accounts
  const [cashAccounts, setCashAccounts] = useState<CashAccount[]>([
    { id: "CA-01", name: "Main Till", custodian: "Aisha Otieno", balance: 12420 },
    { id: "CA-02", name: "Petty Cash", custodian: "John Mwangi", balance: 1850 },
  ]);

  // Modal State for New Account
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [bankName, setBankName] = useState("");
  const [bankBranch, setBankBranch] = useState("");
  const [accountName, setAccountName] = useState("");
  const [accountNumber, setAccountNumber] = useState("");
  const [accountType, setAccountType] = useState("Current");
  const [branch, setBranch] = useState("Nairobi CBD");
  const [currencyCode, setCurrencyCode] = useState("TZS");

  // Manage Banks Modal States
  const [isManageBanksOpen, setIsManageBanksOpen] = useState(false);
  const [activeSetupTab, setActiveSetupTab] = useState<"banks" | "branches">("banks");

  const [registeredBanks, setRegisteredBanks] = useState([
    { code: "NMB", name: "National Microfinance Bank", swift: "NMBTZTZ", address: "Azikiwe Street, Dar es Salaam" },
    { code: "CRDB", name: "CRDB Bank Plc", swift: "CRDBTZTZ", address: "Ally Hassan Mwinyi Rd, Dar es Salaam" },
    { code: "KCB", name: "KCB Bank Tanzania", swift: "KCBTZTZ", address: "Harambee Street, Dar es Salaam" },
  ]);

  const [registeredBranches, setRegisteredBranches] = useState([
    { bankCode: "NMB", name: "Depima Technology Branch", code: "NMB-057", region: "Dar es Salaam" },
    { bankCode: "CRDB", name: "Mbezi Luis Branch", code: "CRDB-190", region: "Dar es Salaam" },
  ]);

  // Form states for new bank
  const [newBankCode, setNewBankCode] = useState("");
  const [newBankName, setNewBankName] = useState("");
  const [newBankSwift, setNewBankSwift] = useState("");
  const [newBankAddress, setNewBankAddress] = useState("");

  // Form states for new branch
  const [newBranchBankCode, setNewBranchBankCode] = useState("NMB");
  const [newBranchName, setNewBranchName] = useState("");
  const [newBranchCode, setNewBranchCode] = useState("");
  const [newBranchRegion, setNewBranchRegion] = useState("Dar es Salaam");

  // Reconciliation Config Parameters State
  const [beginningDate, setBeginningDate] = useState("2026-06-01");
  const [endingDate, setEndingDate] = useState("2026-06-12");
  const [selectedBankId, setSelectedBankId] = useState("BA-04");
  
  // Reconciling workspace states
  const [isReconciling, setIsReconciling] = useState(false);
  const [reconBeginningBalance, setReconBeginningBalance] = useState(25110000);
  const [reconEndingBalanceInput, setReconEndingBalanceInput] = useState("25110057.33");
  const [reconTransactions, setReconTransactions] = useState<Transaction[]>([]);
  const [showSuccessToast, setShowSuccessToast] = useState(false);

  // Reconciliation Log history state
  const [reconciliationList, setReconciliationList] = useState<ReconciliationLog[]>([
    { id: "REC-101", date: "2026-06-12", reconciledBy: "Aisha Otieno", time: "00:45", beginningBalance: 25110000, endingBalance: 25110057.33, clearedBalance: 25110057.33, difference: 0, bankName: "NMB Depima Technology (25110057533)" },
    { id: "REC-100", date: "2026-05-12", reconciledBy: "Aisha Otieno", time: "18:20", beginningBalance: 24500000, endingBalance: 25110000, clearedBalance: 25110000, difference: 0, bankName: "NMB Depima Technology (25110057533)" },
  ]);

  // Pagination and search states for reconciliation list
  const [reconSearch, setReconSearch] = useState("");
  const [reconPageSize, setReconPageSize] = useState(5);
  const [reconPage, setReconPage] = useState(1);

  // Create new bank account
  const handleCreateAccount = (e: React.FormEvent) => {
    e.preventDefault();
    if (!bankName || !accountNumber || !accountName) return;

    const newAcc: BankAccount = {
      id: `BA-0${bankAccounts.length + 1}`,
      bank: bankName,
      branch: bankBranch,
      account: accountNumber,
      name: accountName,
      type: accountType,
      erpBranch: branch,
      balance: 0,
      currency: currencyCode,
    };

    setBankAccounts([...bankAccounts, newAcc]);
    setIsCreateModalOpen(false);

    // Reset Form
    setBankName("");
    setBankBranch("");
    setAccountName("");
    setAccountNumber("");
    setAccountType("Current");
    setBranch("Nairobi CBD");
    setCurrencyCode("TZS");
  };

  // Prepares reconciliation by loading sample transaction checklist
  const handlePrepareReconciliation = () => {
    const chosenBank = bankAccounts.find((b) => b.id === selectedBankId);
    if (!chosenBank) return;

    // Load custom sample dataset for selected bank
    const samples: Transaction[] = [
      { id: 1, date: "2026-06-02", description: "Office Rent Payment", method: "Bank Transfer", reference: "BT-882", payee: "Plaza Properties", deposits: 0, payments: 1200000, cleared: true },
      { id: 2, date: "2026-06-05", description: "Client Deposit (Depima Tech)", method: "EFT", reference: "EFT-00192", payee: "Depima Technology", deposits: 5000000, payments: 0, cleared: true },
      { id: 3, date: "2026-06-07", description: "Supplier Payment A", method: "Cheque", reference: "CHQ-5051", payee: "Supplier A Co.", deposits: 0, payments: 3500000, cleared: true },
      { id: 4, date: "2026-06-10", description: "Store Cash Deposit", method: "Cash", reference: "CD-2910", payee: "Depima Technology", deposits: 1500000, payments: 0, cleared: false },
      { id: 5, date: "2026-06-11", description: "Internet Service Bill", method: "Direct Debit", reference: "DD-901", payee: "Telecom Tanzania", deposits: 0, payments: 180000, cleared: false },
    ];

    setReconBeginningBalance(chosenBank.balance > 1000000 ? 25110000 : 40000);
    // Calculated ending balance matching initially cleared ones (Rent 1,200,000 + Supplier 3,500,000 = Payments 4,700,000, Deposit 5,000,000. Balance = 25,110,000 - 4,700,000 + 5,000,000 = 25,110,300)
    const initialClearedDeposits = samples.filter((t) => t.cleared).reduce((sum, t) => sum + t.deposits, 0);
    const initialClearedPayments = samples.filter((t) => t.cleared).reduce((sum, t) => sum + t.payments, 0);
    const initialBalance = chosenBank.balance > 1000000 ? 25110000 : 40000;
    const computedCleared = initialBalance - initialClearedPayments + initialClearedDeposits;

    setReconTransactions(samples);
    setReconEndingBalanceInput(computedCleared.toString());
    setIsReconciling(true);
  };

  const toggleTransactionCleared = (id: number) => {
    setReconTransactions(
      reconTransactions.map((tx) =>
        tx.id === id ? { ...tx, cleared: !tx.cleared } : tx
      )
    );
  };

  // Computations for active reconciliation
  const reconciliationCalculations = useMemo(() => {
    if (!isReconciling) return { payments: 0, deposits: 0, outstandingPayments: 0, transitDeposits: 0, clearedBalance: 0, difference: 0 };

    const clearedPayments = reconTransactions.filter((t) => t.cleared).reduce((sum, t) => sum + t.payments, 0);
    const clearedDeposits = reconTransactions.filter((t) => t.cleared).reduce((sum, t) => sum + t.deposits, 0);
    const outstandingPayments = reconTransactions.filter((t) => !t.cleared).reduce((sum, t) => sum + t.payments, 0);
    const transitDeposits = reconTransactions.filter((t) => !t.cleared).reduce((sum, t) => sum + t.deposits, 0);

    const clearedBalance = reconBeginningBalance - clearedPayments + clearedDeposits;
    const endingBalance = parseFloat(reconEndingBalanceInput) || 0;
    const difference = endingBalance - clearedBalance;

    return {
      payments: clearedPayments,
      deposits: clearedDeposits,
      outstandingPayments,
      transitDeposits,
      clearedBalance,
      difference,
    };
  }, [isReconciling, reconTransactions, reconBeginningBalance, reconEndingBalanceInput]);

  // Execute Reconcile
  const handleExecuteReconcile = () => {
    const chosenBank = bankAccounts.find((b) => b.id === selectedBankId);
    if (!chosenBank) return;

    const newLog: ReconciliationLog = {
      id: `REC-${100 + reconciliationList.length + 1}`,
      date: new Date().toISOString().split("T")[0],
      reconciledBy: "Aisha Otieno",
      time: new Date().toTimeString().split(" ")[0].slice(0, 5),
      beginningBalance: reconBeginningBalance,
      endingBalance: parseFloat(reconEndingBalanceInput) || 0,
      clearedBalance: reconciliationCalculations.clearedBalance,
      difference: reconciliationCalculations.difference,
      bankName: `${chosenBank.bank} ${chosenBank.branch} (${chosenBank.account})`,
    };

    setReconciliationList([newLog, ...reconciliationList]);
    setIsReconciling(false);
    setShowSuccessToast(true);
    setTimeout(() => setShowSuccessToast(false), 3500);
  };

  // Filter reconciliation log list
  const filteredReconciliation = useMemo(() => {
    const q = reconSearch.toLowerCase();
    if (!q) return reconciliationList;
    return reconciliationList.filter(
      (log) =>
        log.date.includes(q) ||
        log.reconciledBy.toLowerCase().includes(q) ||
        log.bankName.toLowerCase().includes(q) ||
        log.beginningBalance.toString().includes(q) ||
        log.endingBalance.toString().includes(q) ||
        log.clearedBalance.toString().includes(q) ||
        log.difference.toString().includes(q)
    );
  }, [reconciliationList, reconSearch]);

  // Paginated reconciliation logs
  const paginatedLogs = useMemo(() => {
    const start = (reconPage - 1) * reconPageSize;
    return filteredReconciliation.slice(start, start + reconPageSize);
  }, [filteredReconciliation, reconPage, reconPageSize]);

  const totalReconPages = Math.max(1, Math.ceil(filteredReconciliation.length / reconPageSize));

  return (
    <div className="space-y-6">
      {showSuccessToast && (
        <div className="fixed right-4 top-20 z-50 flex items-center gap-3 rounded-2xl border border-emerald-100 bg-emerald-50/90 p-4 text-emerald-800 shadow-xl backdrop-blur-md animate-in slide-in-from-right duration-300">
          <Check className="h-5 w-5 rounded-full bg-emerald-500 text-white p-0.5" />
          <div>
            <p className="text-sm font-bold">{lang === "en" ? "Reconciliation Complete" : "Usuluhishi Umekamilika"}</p>
            <p className="text-xs text-emerald-600/90">{lang === "en" ? "The bank reconciliation log was saved successfully." : "Kumbukumbu ya usuluhishi wa benki imehifadhiwa vizuri."}</p>
          </div>
        </div>
      )}

      <PageHeader
        title={t("bankCash")}
        description={lang === "en" ? "Bank accounts, cash accounts, banks, and branches." : "Akaunti za benki, taslimu, mabenki, na matawi ya benki."}
        actions={
          <div className="flex items-center gap-2">
            <button
              onClick={() => setIsManageBanksOpen(true)}
              className="inline-flex items-center gap-1.5 rounded-xl border border-slate-200 bg-white px-4 py-2 text-xs font-semibold text-slate-700 shadow-sm hover:bg-slate-50 transition cursor-pointer"
            >
              {lang === "en" ? "Manage Banks" : "Dhibiti Benki"}
            </button>
            <button
              onClick={() => setIsCreateModalOpen(true)}
              className="inline-flex items-center gap-1.5 rounded-xl bg-blue-500 px-4 py-2 text-xs font-semibold text-white shadow-md hover:bg-blue-600 transition cursor-pointer"
            >
              <Plus className="h-4 w-4" />
              {t("newAccount")}
            </button>
            <ExportMenu />
          </div>
        }
      />

      <TabbedPage
        tabs={[
          {
            key: "bank",
            label: t("bankAccounts"),
            render: () => (
              <div className="glass-card p-0 overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b border-blue-100 bg-blue-50/50">
                        <th className="px-6 py-3.5 text-left text-xs font-bold uppercase tracking-wider text-blue-800">ID</th>
                        <th className="px-6 py-3.5 text-left text-xs font-bold uppercase tracking-wider text-blue-800">{lang === "en" ? "Account Name" : "Jina la Akaunti"}</th>
                        <th className="px-6 py-3.5 text-left text-xs font-bold uppercase tracking-wider text-blue-800">{lang === "en" ? "Account No" : "Namba ya Akaunti"}</th>
                        <th className="px-6 py-3.5 text-left text-xs font-bold uppercase tracking-wider text-blue-800">{t("bankName")}</th>
                        <th className="px-6 py-3.5 text-left text-xs font-bold uppercase tracking-wider text-blue-800">{t("bankBranch")}</th>
                        <th className="px-6 py-3.5 text-left text-xs font-bold uppercase tracking-wider text-blue-800">{t("branchLabel")}</th>
                        <th className="px-6 py-3.5 text-left text-xs font-bold uppercase tracking-wider text-blue-800">{t("accountType")}</th>
                        <th className="px-6 py-3.5 text-left text-xs font-bold uppercase tracking-wider text-blue-800">{lang === "en" ? "Currency" : "Sarafu"}</th>
                        <th className="px-6 py-3.5 text-right text-xs font-bold uppercase tracking-wider text-blue-800">{lang === "en" ? "Balance" : "Salio"}</th>
                        <th className="px-6 py-3.5 text-center text-xs font-bold uppercase tracking-wider text-blue-800">{lang === "en" ? "Action" : "Kitendo"}</th>
                      </tr>
                    </thead>
                    <tbody>
                      {bankAccounts.map((acc) => (
                        <tr key={acc.id} className="border-b border-blue-100/30 transition-colors hover:bg-blue-50/10">
                          <td className="px-6 py-4 font-semibold text-slate-900">{acc.id}</td>
                          <td className="px-6 py-4 text-slate-700">{acc.name}</td>
                          <td className="px-6 py-4 font-mono text-slate-700">{acc.account}</td>
                          <td className="px-6 py-4 text-slate-700">{acc.bank}</td>
                          <td className="px-6 py-4 text-slate-600">{acc.branch}</td>
                          <td className="px-6 py-4 text-slate-600">{acc.erpBranch}</td>
                          <td className="px-6 py-4">
                            <span className="rounded-full bg-slate-100 px-2.5 py-1 text-xs font-medium text-slate-600">{acc.type}</span>
                          </td>
                          <td className="px-6 py-4 text-slate-600 uppercase font-medium">{acc.currency}</td>
                          <td className="px-6 py-4 text-right font-bold text-slate-900 tabular-nums">
                            {currency(acc.balance).replace("$", "")}
                          </td>
                          <td className="px-6 py-4 text-center">
                            <button
                              onClick={() => {
                                setBankAccounts(prev => prev.filter(b => b.id !== acc.id));
                              }}
                              className="text-xs font-semibold text-rose-600 hover:text-rose-800 cursor-pointer"
                            >
                              {lang === "en" ? "Delete" : "Futa"}
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            ),
          },
          {
            key: "cash",
            label: t("cashAccount"),
            render: () => (
              <div className="glass-card p-0 overflow-hidden">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-blue-100 bg-blue-50/50">
                      <th className="px-6 py-3.5 text-left text-xs font-bold uppercase tracking-wider text-blue-800">ID</th>
                      <th className="px-6 py-3.5 text-left text-xs font-bold uppercase tracking-wider text-blue-800">Account</th>
                      <th className="px-6 py-3.5 text-left text-xs font-bold uppercase tracking-wider text-blue-800">Custodian</th>
                      <th className="px-6 py-3.5 text-right text-xs font-bold uppercase tracking-wider text-blue-800">Balance</th>
                    </tr>
                  </thead>
                  <tbody>
                    {cashAccounts.map((c) => (
                      <tr key={c.id} className="border-b border-blue-100/30 transition-colors hover:bg-blue-50/10">
                        <td className="px-6 py-4 font-semibold text-slate-900">{c.id}</td>
                        <td className="px-6 py-4 text-slate-700">{c.name}</td>
                        <td className="px-6 py-4 text-slate-600">{c.custodian}</td>
                        <td className="px-6 py-4 text-right font-bold text-slate-900 tabular-nums">
                          TZS {currency(c.balance).replace("$", "")}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ),
          },
          {
            key: "reconciliation",
            label: t("bankReconciliation"),
            render: () => (
              <div className="space-y-6">
                {/* Form Parameters */}
                <div className="glass-card p-5">
                  <h2 className="mb-4 text-sm font-bold uppercase tracking-wider text-slate-500">{t("bankReconciliation")}</h2>
                  <div className="grid gap-4 sm:grid-cols-4 items-end">
                    <div className="space-y-1">
                      <label className="block text-xs font-medium text-slate-700">{t("beginningDate")}</label>
                      <input
                        type="date"
                        value={beginningDate}
                        onChange={(e) => setBeginningDate(e.target.value)}
                        className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3.5 py-2 text-sm text-slate-800 outline-none focus:border-blue-400 focus:bg-white focus:ring-2 focus:ring-blue-100"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="block text-xs font-medium text-slate-700">{t("endingDate")}</label>
                      <input
                        type="date"
                        value={endingDate}
                        onChange={(e) => setEndingDate(e.target.value)}
                        className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3.5 py-2 text-sm text-slate-800 outline-none focus:border-blue-400 focus:bg-white focus:ring-2 focus:ring-blue-100"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="block text-xs font-medium text-slate-700">{t("selectBank")}</label>
                      <select
                        value={selectedBankId}
                        onChange={(e) => setSelectedBankId(e.target.value)}
                        className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3.5 py-2 text-sm text-slate-800 outline-none focus:border-blue-400 focus:bg-white focus:ring-2 focus:ring-blue-100"
                      >
                        {bankAccounts.map((b) => (
                          <option key={b.id} value={b.id}>
                            {b.bank} - {b.branch} ({b.account})
                          </option>
                        ))}
                      </select>
                    </div>
                    <button
                      onClick={handlePrepareReconciliation}
                      className="inline-flex justify-center items-center gap-1.5 h-10 rounded-xl bg-blue-500 px-4 text-sm font-semibold text-white shadow-md hover:bg-blue-600 transition"
                    >
                      <RefreshCw className="h-4 w-4" />
                      {t("prepareReconciliation")}
                    </button>
                  </div>
                </div>

                {/* Reconciliation Workspace */}
                {isReconciling && (
                  <div className="glass-card p-6 border-blue-200/60 shadow-lg space-y-6">
                    {/* Header */}
                    <div className="flex flex-col gap-1 border-b border-slate-100 pb-4">
                      <h2 className="text-base font-bold text-slate-900">
                        {lang === "en" ? "RECONCILE" : "SULUHISHA"}{" "}
                        {bankAccounts.find((b) => b.id === selectedBankId)?.bank.toUpperCase()}{" "}
                        {bankAccounts.find((b) => b.id === selectedBankId)?.branch.toUpperCase()}{" "}
                        {bankAccounts.find((b) => b.id === selectedBankId)?.account}
                      </h2>
                      <p className="text-xs text-slate-500 font-medium uppercase tracking-wider">
                        {t("statementEndingDate")}: {new Date(endingDate).toLocaleDateString(undefined, { day: "2-digit", month: "short", year: "numeric" })}
                      </p>
                    </div>

                    {/* Reconciliation Math Boxes */}
                    <div className="grid gap-4 grid-cols-2 sm:grid-cols-4">
                      <div className="rounded-xl border border-slate-200 bg-[#f4f6f7]/60 p-4 space-y-1">
                        <label className="block text-[11px] font-bold text-slate-400 tracking-wider uppercase">{t("statementEndingBalance")}</label>
                        <input
                          type="number"
                          value={reconEndingBalanceInput}
                          onChange={(e) => setReconEndingBalanceInput(e.target.value)}
                          className="w-full bg-transparent text-base font-bold text-slate-900 border-b border-slate-300 focus:border-blue-500 outline-none tabular-nums"
                        />
                      </div>
                      <div className="rounded-xl border border-slate-200 bg-white p-4 space-y-1">
                        <span className="block text-[11px] font-bold text-slate-400 tracking-wider uppercase">{t("clearedBalance")}</span>
                        <span className="text-base font-bold text-slate-800 tabular-nums">TZS {currency(reconciliationCalculations.clearedBalance).replace("$", "")}</span>
                      </div>
                      <div className="rounded-xl border border-slate-200 bg-white p-4 space-y-1">
                        <span className="block text-[11px] font-bold text-slate-400 tracking-wider uppercase">{t("difference")}</span>
                        <span className={`text-base font-bold tabular-nums ${reconciliationCalculations.difference === 0 ? "text-emerald-600" : "text-rose-600"}`}>
                          TZS {currency(reconciliationCalculations.difference).replace("$", "")}
                        </span>
                      </div>
                      <div className="rounded-xl border border-slate-200 bg-[#1f9c88]/5 p-4 space-y-1">
                        <span className="block text-[11px] font-bold text-[#1f9c88]/80 tracking-wider uppercase">{lang === "en" ? "RECONCILIATION ACTIONS" : "VITENDO VYA USULUHISHI"}</span>
                        <button
                          disabled={reconciliationCalculations.difference !== 0}
                          onClick={handleExecuteReconcile}
                          className="mt-1 w-full rounded-lg bg-[#1f9c88] py-1.5 text-xs font-semibold text-white shadow-sm hover:bg-[#156458] transition disabled:opacity-40 disabled:hover:bg-[#1f9c88] flex items-center justify-center gap-1"
                        >
                          <Check className="h-3.5 w-3.5" />
                          {t("executeReconcile")}
                        </button>
                      </div>
                    </div>

                    {/* Detailed Math rows */}
                    <div className="grid gap-4 sm:grid-cols-3 text-xs bg-slate-50/50 p-4 rounded-xl border border-slate-100">
                      <div className="space-y-1">
                        <div className="flex justify-between"><span className="text-slate-500">{t("beginningBalance")}</span><span className="font-semibold tabular-nums">TZS {currency(reconBeginningBalance).replace("$", "")}</span></div>
                        <div className="flex justify-between"><span className="text-slate-500">{t("payments")} (-)</span><span className="font-semibold text-rose-600 tabular-nums">TZS {currency(reconciliationCalculations.payments).replace("$", "")}</span></div>
                        <div className="flex justify-between"><span className="text-slate-500">{t("deposits")} (+)</span><span className="font-semibold text-emerald-600 tabular-nums">TZS {currency(reconciliationCalculations.deposits).replace("$", "")}</span></div>
                      </div>
                      <div className="h-px bg-slate-200 sm:hidden" />
                      <div className="space-y-1 border-slate-200 sm:border-l sm:pl-4">
                        <div className="flex justify-between"><span className="text-slate-500">{t("outstandingPayments")} (-)</span><span className="font-semibold text-slate-700 tabular-nums">TZS {currency(reconciliationCalculations.outstandingPayments).replace("$", "")}</span></div>
                        <div className="flex justify-between"><span className="text-slate-500">{t("depositTransit")} (+)</span><span className="font-semibold text-slate-700 tabular-nums">TZS {currency(reconciliationCalculations.transitDeposits).replace("$", "")}</span></div>
                      </div>
                      <div className="h-px bg-slate-200 sm:hidden" />
                      <div className="flex flex-col justify-center border-slate-200 sm:border-l sm:pl-4">
                        {reconciliationCalculations.difference !== 0 ? (
                          <div className="flex items-center gap-1.5 text-amber-700 bg-amber-50 border border-amber-100 rounded-lg p-2.5">
                            <ShieldAlert className="h-4 w-4 shrink-0 text-amber-600" />
                            <p className="leading-normal text-[10.5px]">
                              {lang === "en" ? "Difference must be 0 to complete reconciliation." : "Tofauti lazima iwe 0 ili kukamilisha usuluhishi."}
                            </p>
                          </div>
                        ) : (
                          <div className="flex items-center gap-1.5 text-emerald-700 bg-emerald-50 border border-emerald-100 rounded-lg p-2.5">
                            <Check className="h-4 w-4 shrink-0 text-emerald-600 rounded-full bg-emerald-200 p-0.5" />
                            <p className="leading-normal text-[10.5px]">
                              {lang === "en" ? "Balanced! You can now execute the reconciliation." : "Imesuluhishwa! Sasa unaweza kukamilisha usuluhishi."}
                            </p>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Transaction checklist table */}
                    <div className="space-y-2">
                      <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500">Checklist</h4>
                      <div className="overflow-x-auto rounded-xl border border-slate-100 bg-white">
                        <table className="w-full text-sm">
                          <thead>
                            <tr className="border-b border-slate-100 bg-slate-50/50">
                              <th className="w-12 px-4 py-2.5 text-center text-xs font-bold text-slate-500 uppercase">Cleared</th>
                              <th className="px-4 py-2.5 text-left text-xs font-bold text-slate-500 uppercase">Date</th>
                              <th className="px-4 py-2.5 text-left text-xs font-bold text-slate-500 uppercase">Description</th>
                              <th className="px-4 py-2.5 text-left text-xs font-bold text-slate-500 uppercase">{t("paymentMethod")}</th>
                              <th className="px-4 py-2.5 text-left text-xs font-bold text-slate-500 uppercase">{t("reference")}</th>
                              <th className="px-4 py-2.5 text-left text-xs font-bold text-slate-500 uppercase">{t("payee")}</th>
                              <th className="px-4 py-2.5 text-right text-xs font-bold text-slate-500 uppercase">Deposits</th>
                              <th className="px-4 py-2.5 text-right text-xs font-bold text-slate-500 uppercase">Payments</th>
                            </tr>
                          </thead>
                          <tbody>
                            {reconTransactions.map((tx) => (
                              <tr
                                key={tx.id}
                                className={`border-b border-slate-100/50 last:border-0 hover:bg-slate-50/40 cursor-pointer ${tx.cleared && "bg-blue-50/20"}`}
                                onClick={() => toggleTransactionCleared(tx.id)}
                              >
                                <td className="px-4 py-3 text-center">
                                  <button
                                    type="button"
                                    onClick={(e) => { e.stopPropagation(); toggleTransactionCleared(tx.id); }}
                                    className="text-blue-500 focus:outline-none"
                                  >
                                    {tx.cleared ? (
                                      <CheckSquare className="h-4.5 w-4.5 text-[#1f9c88]" />
                                    ) : (
                                      <Square className="h-4.5 w-4.5 text-slate-300" />
                                    )}
                                  </button>
                                </td>
                                <td className="px-4 py-3 text-slate-700 whitespace-nowrap text-xs">{tx.date}</td>
                                <td className="px-4 py-3 text-slate-700 text-xs">{tx.description}</td>
                                <td className="px-4 py-3 text-slate-600 text-xs">{tx.method}</td>
                                <td className="px-4 py-3 font-mono text-slate-600 text-xs">{tx.reference}</td>
                                <td className="px-4 py-3 text-slate-600 text-xs">{tx.payee}</td>
                                <td className="px-4 py-3 text-right text-emerald-600 font-semibold text-xs tabular-nums">
                                  {tx.deposits > 0 ? `TZS ${currency(tx.deposits).replace("$", "")}` : "-"}
                                </td>
                                <td className="px-4 py-3 text-right text-rose-600 font-semibold text-xs tabular-nums">
                                  {tx.payments > 0 ? `TZS ${currency(tx.payments).replace("$", "")}` : "-"}
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </div>
                  </div>
                )}

                {/* Bank Reconciliation Log List */}
                <div className="glass-card p-5 space-y-4">
                  <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
                    <h2 className="text-sm font-bold uppercase tracking-wider text-slate-500">{t("reconciliationList")}</h2>
                    
                    <div className="flex items-center gap-3 w-full sm:w-auto">
                      <div className="flex items-center gap-1.5 text-xs text-slate-500">
                        <span>{t("showEntries")}:</span>
                        <select
                          value={reconPageSize}
                          onChange={(e) => { setReconPageSize(parseInt(e.target.value)); setReconPage(1); }}
                          className="rounded-lg border border-slate-200 bg-slate-50 px-2 py-1 outline-none text-slate-700 focus:bg-white"
                        >
                          {[5, 10, 20, 50].map((sz) => <option key={sz} value={sz}>{sz}</option>)}
                        </select>
                      </div>

                      <div className="relative max-w-xs flex-1 sm:w-60">
                        <Search className="absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-slate-400" />
                        <input
                          type="text"
                          placeholder={lang === "en" ? "Search log list..." : "Tafuta orodha..."}
                          value={reconSearch}
                          onChange={(e) => { setReconSearch(e.target.value); setReconPage(1); }}
                          className="w-full rounded-xl border border-slate-200 bg-slate-50 pl-9 pr-4 py-1.5 text-xs text-slate-800 outline-none focus:border-blue-400 focus:bg-white focus:ring-2 focus:ring-blue-100"
                        />
                      </div>
                    </div>
                  </div>

                  <div className="overflow-x-auto rounded-xl border border-slate-100 bg-white">
                    <table className="w-full text-sm">
                      <thead>
                        <tr className="border-b border-slate-100 bg-slate-50/50">
                          <th className="px-5 py-3 text-left text-xs font-bold text-slate-500 uppercase tracking-wider">{t("date")}</th>
                          <th className="px-5 py-3 text-left text-xs font-bold text-slate-500 uppercase tracking-wider">{t("reconciledBy")}</th>
                          <th className="px-5 py-3 text-left text-xs font-bold text-slate-500 uppercase tracking-wider">{t("time")}</th>
                          <th className="px-5 py-3 text-left text-xs font-bold text-slate-500 uppercase tracking-wider">{lang === "en" ? "Bank" : "Benki"}</th>
                          <th className="px-5 py-3 text-right text-xs font-bold text-slate-500 uppercase tracking-wider">{lang === "en" ? "Beginning Balance (TZS)" : "Salio la Kuanzia (TZS)"}</th>
                          <th className="px-5 py-3 text-right text-xs font-bold text-slate-500 uppercase tracking-wider">{lang === "en" ? "Ending Balance (TZS)" : "Salio la Mwisho (TZS)"}</th>
                          <th className="px-5 py-3 text-right text-xs font-bold text-slate-500 uppercase tracking-wider">{lang === "en" ? "Cleared Balance (TZS)" : "Salio Lililosuluhishwa (TZS)"}</th>
                          <th className="px-5 py-3 text-right text-xs font-bold text-slate-500 uppercase tracking-wider">{lang === "en" ? "Difference (TZS)" : "Tofauti (TZS)"}</th>
                          <th className="px-5 py-3 text-center text-xs font-bold text-slate-500 uppercase tracking-wider">{t("actionLabel")}</th>
                        </tr>
                      </thead>
                      <tbody>
                        {paginatedLogs.length === 0 ? (
                          <tr>
                            <td colSpan={9} className="px-5 py-8 text-center text-xs text-slate-400">
                              {lang === "en" ? "No reconciliation records found." : "Hakuna kumbukumbu za usuluhishi zilizopatikana."}
                            </td>
                          </tr>
                        ) : paginatedLogs.map((log) => (
                          <tr key={log.id} className="border-b border-slate-100/60 last:border-0 hover:bg-slate-50/10">
                            <td className="px-5 py-3.5 font-medium text-slate-900 whitespace-nowrap text-xs">{log.date}</td>
                            <td className="px-5 py-3.5 text-slate-700 text-xs">{log.reconciledBy}</td>
                            <td className="px-5 py-3.5 text-slate-500 text-xs">{log.time}</td>
                            <td className="px-5 py-3.5 text-slate-600 text-xs truncate max-w-xs">{log.bankName}</td>
                            <td className="px-5 py-3.5 text-right font-semibold text-slate-700 text-xs tabular-nums">{currency(log.beginningBalance).replace("$", "")}</td>
                            <td className="px-5 py-3.5 text-right font-semibold text-slate-700 text-xs tabular-nums">{currency(log.endingBalance).replace("$", "")}</td>
                            <td className="px-5 py-3.5 text-right font-bold text-slate-900 text-xs tabular-nums">{currency(log.clearedBalance).replace("$", "")}</td>
                            <td className="px-5 py-3.5 text-right text-xs font-bold tabular-nums">
                              <span className={log.difference === 0 ? "text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full" : "text-rose-600 bg-rose-50 px-2 py-0.5 rounded-full"}>
                                {currency(log.difference).replace("$", "")}
                              </span>
                            </td>
                            <td className="px-5 py-3.5 text-center">
                              <span className="inline-flex items-center gap-1 rounded-full bg-emerald-100 px-2 py-0.5 text-[10px] font-bold text-emerald-800 uppercase">
                                Reconciled
                              </span>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>

                  {/* Pagination control */}
                  {totalReconPages > 1 && (
                    <div className="flex items-center justify-between border-t border-slate-100 pt-3">
                      <span className="text-xs text-slate-500">
                        {lang === "en" ? `Page ${reconPage} of ${totalReconPages} — ${filteredReconciliation.length} records` : `Ukurasa ${reconPage} kati ya ${totalReconPages} — kumbukumbu ${filteredReconciliation.length}`}
                      </span>
                      <div className="flex gap-1.5">
                        <button
                          onClick={() => setReconPage((p) => Math.max(1, p - 1))}
                          disabled={reconPage === 1}
                          className="rounded-lg border border-slate-200 bg-white px-3 py-1 text-xs font-medium text-slate-600 transition hover:bg-slate-50 disabled:opacity-40"
                        >
                          {lang === "en" ? "Previous" : "Tangulia"}
                        </button>
                        <button
                          onClick={() => setReconPage((p) => Math.min(totalReconPages, p + 1))}
                          disabled={reconPage === totalReconPages}
                          className="rounded-lg border border-slate-200 bg-white px-3 py-1 text-xs font-medium text-slate-600 transition hover:bg-slate-50 disabled:opacity-40"
                        >
                          {lang === "en" ? "Next" : "Fuata"}
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            ),
          },
          {
            key: "banks",
            label: t("banks"),
            render: () => (
              <div className="glass-card p-0 overflow-hidden">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-blue-100 bg-blue-50/50">
                      <th className="px-6 py-3.5 text-left text-xs font-bold uppercase tracking-wider text-blue-800">Code</th>
                      <th className="px-6 py-3.5 text-left text-xs font-bold uppercase tracking-wider text-blue-800">Bank</th>
                      <th className="px-6 py-3.5 text-right text-xs font-bold uppercase tracking-wider text-blue-800">Branches</th>
                    </tr>
                  </thead>
                  <tbody>
                    {["KCB", "Equity", "NCBA", "Co-operative", "Stanbic"].map((b, i) => (
                      <tr key={b} className="border-b border-blue-100/30 transition-colors hover:bg-blue-50/10">
                        <td className="px-6 py-4 font-semibold text-slate-900">BK-{10 + i}</td>
                        <td className="px-6 py-4 text-slate-700">{b}</td>
                        <td className="px-6 py-4 text-right text-slate-600 font-medium">{3 + i}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ),
          },
          {
            key: "branches",
            label: t("bankBranches"),
            render: () => (
              <div className="glass-card p-0 overflow-hidden">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-blue-100 bg-blue-50/50">
                      <th className="px-6 py-3.5 text-left text-xs font-bold uppercase tracking-wider text-blue-800">Code</th>
                      <th className="px-6 py-3.5 text-left text-xs font-bold uppercase tracking-wider text-blue-800">Bank</th>
                      <th className="px-6 py-3.5 text-left text-xs font-bold uppercase tracking-wider text-blue-800">Branch</th>
                      <th className="px-6 py-3.5 text-left text-xs font-bold uppercase tracking-wider text-blue-800">SWIFT</th>
                    </tr>
                  </thead>
                  <tbody>
                    {["CBD", "Westlands", "Mombasa", "Kisumu", "Eldoret"].map((b, i) => (
                      <tr key={b} className="border-b border-blue-100/30 transition-colors hover:bg-blue-50/10">
                        <td className="px-6 py-4 font-semibold text-slate-900">BR-{20 + i}</td>
                        <td className="px-6 py-4 text-slate-700">KCB</td>
                        <td className="px-6 py-4 text-slate-600">{b}</td>
                        <td className="px-6 py-4 font-mono text-slate-600">KCBLKE{i}1</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ),
          },
        ]}
      />

      {/* New Account Dialog */}
      <Dialog open={isCreateModalOpen} onOpenChange={setIsCreateModalOpen}>
        <DialogContent className="max-w-md bg-white rounded-2xl p-6 shadow-xl border border-slate-100">
          <DialogHeader className="border-b border-slate-100 pb-3 mb-4">
            <DialogTitle className="text-base font-bold text-slate-900">{t("newAccount")}</DialogTitle>
          </DialogHeader>

          <form onSubmit={handleCreateAccount} className="space-y-4">
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-1 sm:col-span-2">
                <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wide">{t("bankName")} *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. NMB Bank"
                  value={bankName}
                  onChange={(e) => setBankName(e.target.value)}
                  className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3.5 py-2 text-sm text-slate-800 outline-none focus:border-blue-400 focus:bg-white focus:ring-2 focus:ring-blue-100"
                />
              </div>

              <div className="space-y-1">
                <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wide">{t("bankBranch")}</label>
                <input
                  type="text"
                  placeholder="e.g. Oysterbay"
                  value={bankBranch}
                  onChange={(e) => setBankBranch(e.target.value)}
                  className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3.5 py-2 text-sm text-slate-800 outline-none focus:border-blue-400 focus:bg-white focus:ring-2 focus:ring-blue-100"
                />
              </div>

              <div className="space-y-1">
                <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wide">{t("accountType")}</label>
                <select
                  value={accountType}
                  onChange={(e) => setAccountType(e.target.value)}
                  className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3.5 py-2 text-sm text-slate-800 outline-none focus:border-blue-400 focus:bg-white focus:ring-2 focus:ring-blue-100"
                >
                  <option value="Current">Current</option>
                  <option value="Savings">Savings</option>
                  <option value="Fixed Deposit">Fixed Deposit</option>
                </select>
              </div>

              <div className="space-y-1 sm:col-span-2">
                <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wide">{t("accountName")} *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Depima Technology"
                  value={accountName}
                  onChange={(e) => setAccountName(e.target.value)}
                  className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3.5 py-2 text-sm text-slate-800 outline-none focus:border-blue-400 focus:bg-white focus:ring-2 focus:ring-blue-100"
                />
              </div>

              <div className="space-y-1 sm:col-span-2">
                <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wide">{t("accountNumber")} *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. 25110057533"
                  value={accountNumber}
                  onChange={(e) => setAccountNumber(e.target.value)}
                  className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3.5 py-2 text-sm text-slate-800 outline-none focus:border-blue-400 focus:bg-white focus:ring-2 focus:ring-blue-100"
                />
              </div>

              <div className="space-y-1">
                <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wide">{t("branchLabel")}</label>
                <select
                  value={branch}
                  onChange={(e) => setBranch(e.target.value)}
                  className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3.5 py-2 text-sm text-slate-800 outline-none focus:border-blue-400 focus:bg-white focus:ring-2 focus:ring-blue-100"
                >
                  <option value="Head Office">Head Office</option>
                  <option value="Nairobi CBD">Nairobi CBD</option>
                  <option value="Westlands">Westlands</option>
                  <option value="Mombasa">Mombasa</option>
                  <option value="Kisumu">Kisumu</option>
                  <option value="Eldoret">Eldoret</option>
                </select>
              </div>

              <div className="space-y-1">
                <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wide">{t("currencyLabel")}</label>
                <select
                  value={currencyCode}
                  onChange={(e) => setCurrencyCode(e.target.value)}
                  className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3.5 py-2 text-sm text-slate-800 outline-none focus:border-blue-400 focus:bg-white focus:ring-2 focus:ring-blue-100"
                >
                  <option value="TZS">TZS</option>
                  <option value="USD">USD</option>
                  <option value="KES">KES</option>
                  <option value="EUR">EUR</option>
                </select>
              </div>
            </div>

            <div className="flex justify-end gap-2 border-t border-slate-100 pt-4 mt-6">
              <button
                type="button"
                onClick={() => setIsCreateModalOpen(false)}
                className="rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-xs font-medium text-slate-600 hover:bg-slate-50 transition cursor-pointer"
              >
                {t("cancel")}
              </button>
              <button
                type="submit"
                className="rounded-xl bg-blue-500 px-4 py-2.5 text-xs font-semibold text-white shadow-md hover:bg-blue-600 transition cursor-pointer"
              >
                {lang === "en" ? "Create Account" : "Fungua Akaunti"}
              </button>
            </div>
          </form>
        </DialogContent>
      </Dialog>

      {/* Manage Banks Setup Modal */}
      <Dialog open={isManageBanksOpen} onOpenChange={setIsManageBanksOpen}>
        <DialogContent className="max-w-2xl max-h-[85vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-base font-bold">
              {lang === "en" ? "Manage Banks & Branches Directory" : "Dhibiti Saraka ya Mabenki na Matawi"}
            </DialogTitle>
          </DialogHeader>

          {/* Local Tabs */}
          <div className="flex gap-2 border-b border-slate-100 pb-2 mt-2">
            <button
              onClick={() => setActiveSetupTab("banks")}
              className={`text-xs font-semibold pb-1.5 border-b-2 transition cursor-pointer ${
                activeSetupTab === "banks" ? "border-blue-500 text-blue-600" : "border-transparent text-slate-500 hover:text-slate-800"
              }`}
            >
              {lang === "en" ? "Banks Setup" : "Mipangilio ya Mabenki"}
            </button>
            <button
              onClick={() => setActiveSetupTab("branches")}
              className={`text-xs font-semibold pb-1.5 border-b-2 transition cursor-pointer ${
                activeSetupTab === "branches" ? "border-blue-500 text-blue-600" : "border-transparent text-slate-500 hover:text-slate-800"
              }`}
            >
              {lang === "en" ? "Bank Branches" : "Matawi ya Benki"}
            </button>
          </div>

          {activeSetupTab === "banks" ? (
            <div className="space-y-4 mt-3">
              {/* Add Bank Form */}
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  if (!newBankCode || !newBankName) return;
                  setRegisteredBanks(prev => [
                    ...prev,
                    { code: newBankCode, name: newBankName, swift: newBankSwift, address: newBankAddress }
                  ]);
                  setNewBankCode("");
                  setNewBankName("");
                  setNewBankSwift("");
                  setNewBankAddress("");
                }}
                className="grid grid-cols-2 gap-3 border border-slate-100 rounded-xl p-3 bg-slate-50/50"
              >
                <div>
                  <label className="block text-[10px] font-bold text-slate-500 mb-1">{lang === "en" ? "Bank Code" : "Kodi ya Benki"}</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. NMB"
                    value={newBankCode}
                    onChange={(e) => setNewBankCode(e.target.value)}
                    className="w-full text-xs rounded-lg border border-slate-200 bg-white p-2 outline-none"
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-bold text-slate-500 mb-1">{lang === "en" ? "Bank Name" : "Jina la Benki"}</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. National Microfinance Bank"
                    value={newBankName}
                    onChange={(e) => setNewBankName(e.target.value)}
                    className="w-full text-xs rounded-lg border border-slate-200 bg-white p-2 outline-none"
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-bold text-slate-500 mb-1">{lang === "en" ? "Swift Code" : "Kodi ya SWIFT"}</label>
                  <input
                    type="text"
                    value={newBankSwift}
                    onChange={(e) => setNewBankSwift(e.target.value)}
                    className="w-full text-xs rounded-lg border border-slate-200 bg-white p-2 outline-none"
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-bold text-slate-500 mb-1">{lang === "en" ? "Head Office Address" : "Anwani ya Makao Makuu"}</label>
                  <input
                    type="text"
                    value={newBankAddress}
                    onChange={(e) => setNewBankAddress(e.target.value)}
                    className="w-full text-xs rounded-lg border border-slate-200 bg-white p-2 outline-none"
                  />
                </div>
                <div className="col-span-2 flex justify-end">
                  <button type="submit" className="rounded-lg bg-blue-500 px-3 py-1.5 text-xs font-semibold text-white hover:bg-blue-600 transition cursor-pointer">
                    {lang === "en" ? "Add Bank" : "Ongeza Benki"}
                  </button>
                </div>
              </form>

              {/* Banks list */}
              <div className="overflow-x-auto rounded-xl border border-slate-100">
                <table className="w-full text-xs">
                  <thead>
                    <tr className="border-b border-blue-50 bg-blue-50/20 text-blue-800 text-left font-bold">
                      <th className="px-3 py-2">Code</th>
                      <th className="px-3 py-2">Name</th>
                      <th className="px-3 py-2">SWIFT</th>
                      <th className="px-3 py-2">Address</th>
                      <th className="px-3 py-2 text-center">Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {registeredBanks.map(b => (
                      <tr key={b.code} className="border-b border-slate-100/50 text-slate-600">
                        <td className="px-3 py-2 font-bold text-slate-800">{b.code}</td>
                        <td className="px-3 py-2">{b.name}</td>
                        <td className="px-3 py-2 font-mono">{b.swift || "—"}</td>
                        <td className="px-3 py-2">{b.address || "—"}</td>
                        <td className="px-3 py-2 text-center">
                          <button
                            onClick={() => setRegisteredBanks(prev => prev.filter(item => item.code !== b.code))}
                            className="text-rose-600 font-semibold hover:text-rose-800 cursor-pointer"
                          >
                            {lang === "en" ? "Delete" : "Futa"}
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          ) : (
            <div className="space-y-4 mt-3">
              {/* Add Branch Form */}
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  if (!newBranchName || !newBranchCode) return;
                  setRegisteredBranches(prev => [
                    ...prev,
                    { bankCode: newBranchBankCode, name: newBranchName, code: newBranchCode, region: newBranchRegion }
                  ]);
                  setNewBranchName("");
                  setNewBranchCode("");
                }}
                className="grid grid-cols-2 gap-3 border border-slate-100 rounded-xl p-3 bg-slate-50/50"
              >
                <div>
                  <label className="block text-[10px] font-bold text-slate-500 mb-1">{lang === "en" ? "Bank Association" : "Benki Husika"}</label>
                  <select
                    value={newBranchBankCode}
                    onChange={(e) => setNewBranchBankCode(e.target.value)}
                    className="w-full text-xs rounded-lg border border-slate-200 bg-white p-2 outline-none"
                  >
                    {registeredBanks.map(b => (
                      <option key={b.code} value={b.code}>{b.name}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-[10px] font-bold text-slate-500 mb-1">{lang === "en" ? "Branch Name" : "Jina la Tawi"}</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Mbezi Luis Branch"
                    value={newBranchName}
                    onChange={(e) => setNewBranchName(e.target.value)}
                    className="w-full text-xs rounded-lg border border-slate-200 bg-white p-2 outline-none"
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-bold text-slate-500 mb-1">{lang === "en" ? "Branch Code" : "Kodi ya Tawi"}</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. CRDB-190"
                    value={newBranchCode}
                    onChange={(e) => setNewBranchCode(e.target.value)}
                    className="w-full text-xs rounded-lg border border-slate-200 bg-white p-2 outline-none"
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-bold text-slate-500 mb-1">{lang === "en" ? "Region" : "Mkoa"}</label>
                  <input
                    type="text"
                    value={newBranchRegion}
                    onChange={(e) => setNewBranchRegion(e.target.value)}
                    className="w-full text-xs rounded-lg border border-slate-200 bg-white p-2 outline-none"
                  />
                </div>
                <div className="col-span-2 flex justify-end">
                  <button type="submit" className="rounded-lg bg-blue-500 px-3 py-1.5 text-xs font-semibold text-white hover:bg-blue-600 transition cursor-pointer">
                    {lang === "en" ? "Add Branch" : "Ongeza Tawi"}
                  </button>
                </div>
              </form>

              {/* Branches list */}
              <div className="overflow-x-auto rounded-xl border border-slate-100">
                <table className="w-full text-xs">
                  <thead>
                    <tr className="border-b border-blue-50 bg-blue-50/20 text-blue-800 text-left font-bold">
                      <th className="px-3 py-2">Bank</th>
                      <th className="px-3 py-2">Branch Name</th>
                      <th className="px-3 py-2">Code</th>
                      <th className="px-3 py-2">Region</th>
                      <th className="px-3 py-2 text-center">Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {registeredBranches.map((br, index) => (
                      <tr key={index} className="border-b border-slate-100/50 text-slate-600">
                        <td className="px-3 py-2 font-bold text-slate-800">{br.bankCode}</td>
                        <td className="px-3 py-2">{br.name}</td>
                        <td className="px-3 py-2 font-mono">{br.code}</td>
                        <td className="px-3 py-2">{br.region}</td>
                        <td className="px-3 py-2 text-center">
                          <button
                            onClick={() => setRegisteredBranches(prev => prev.filter((_, i) => i !== index))}
                            className="text-rose-600 font-semibold hover:text-rose-800 cursor-pointer"
                          >
                            {lang === "en" ? "Delete" : "Futa"}
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          <div className="flex justify-end border-t border-slate-100 pt-3 mt-4">
            <button
              onClick={() => setIsManageBanksOpen(false)}
              className="rounded-lg border border-slate-200 px-4 py-2 text-xs font-semibold hover:bg-slate-50 cursor-pointer"
            >
              {lang === "en" ? "Close" : "Funga"}
            </button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
