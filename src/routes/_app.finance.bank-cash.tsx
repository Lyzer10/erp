import { createFileRoute } from "@tanstack/react-router";
import { PageHeader } from "@/components/erp/PageHeader";
import { TabbedPage } from "@/components/erp/TabbedPage";
import { DataTable } from "@/components/erp/DataTable";
import { currency } from "@/lib/mock";

export const Route = createFileRoute("/_app/finance/bank-cash")({
  head: () => ({ meta: [{ title: "Bank & Cash — Lumen ERP" }] }),
  component: () => (
    <div className="space-y-6">
      <PageHeader title="Bank & Cash" description="Bank accounts, cash accounts, banks, and branches." />
      <TabbedPage tabs={[
        { key: "bank", label: "Bank Accounts", render: () => (
          <DataTable data={[
            { id: "BA-01", bank: "KCB", branch: "Nairobi CBD", account: "1234567890", balance: 86320 },
            { id: "BA-02", bank: "Equity", branch: "Westlands", account: "0998877665", balance: 42810 },
            { id: "BA-03", bank: "NCBA", branch: "Mombasa", account: "5544332211", balance: 18420 },
          ]} columns={[
            { key: "id", header: "ID" }, { key: "bank", header: "Bank" }, { key: "branch", header: "Branch" },
            { key: "account", header: "Account #" },
            { key: "balance", header: "Balance", align: "right", render: (r) => currency(r.balance) },
          ]} />
        )},
        { key: "cash", label: "Cash Account", render: () => (
          <DataTable data={[
            { id: "CA-01", name: "Main Till", custodian: "Aisha Otieno", balance: 12420 },
            { id: "CA-02", name: "Petty Cash", custodian: "John Mwangi", balance: 1850 },
          ]} columns={[
            { key: "id", header: "ID" }, { key: "name", header: "Account" }, { key: "custodian", header: "Custodian" },
            { key: "balance", header: "Balance", align: "right", render: (r) => currency(r.balance) },
          ]} />
        )},
        { key: "banks", label: "Banks", render: () => (
          <DataTable data={["KCB","Equity","NCBA","Co-operative","Stanbic"].map((b, i) => ({ code: `BK-${10+i}`, name: b, branches: 3+i }))}
            columns={[{ key: "code", header: "Code" }, { key: "name", header: "Bank" }, { key: "branches", header: "Branches", align: "right" }]} />
        )},
        { key: "branches", label: "Bank Branches", render: () => (
          <DataTable data={["CBD","Westlands","Mombasa","Kisumu","Eldoret"].map((b, i) => ({ code: `BR-${20+i}`, bank: "KCB", name: b, swift: `KCBLKE${i}1`}))}
            columns={[{ key: "code", header: "Code" }, { key: "bank", header: "Bank" }, { key: "name", header: "Branch" }, { key: "swift", header: "SWIFT" }]} />
        )},
      ]} />
    </div>
  ),
});
