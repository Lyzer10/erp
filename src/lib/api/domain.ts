import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { resolveDataSource } from "../data-source";

export const resetDemoDataFn = createServerFn({ method: "POST" }).handler(async () => {
  const ds = await resolveDataSource();
  const result = await ds.resetDemoData();
  return { isTestUser: ds.isTestUser, ...result };
});

export const getCustomersFn = createServerFn({ method: "GET" }).handler(async () => {
  const ds = await resolveDataSource();
  const data = await ds.customers.getAll();
  return { isTestUser: ds.isTestUser, data };
});

export const createCustomerFn = createServerFn({ method: "POST" })
  .inputValidator(z.object({ name: z.string().min(1), phone: z.string().optional(), email: z.string().optional() }))
  .handler(async ({ data }) => {
    const ds = await resolveDataSource();
    const result = await ds.customers.create(data);
    return { isTestUser: ds.isTestUser, result };
  });

export const getSuppliersFn = createServerFn({ method: "GET" }).handler(async () => {
  const ds = await resolveDataSource();
  const data = await ds.suppliers.getAll();
  return { isTestUser: ds.isTestUser, data };
});

export const createSupplierFn = createServerFn({ method: "POST" })
  .inputValidator(z.object({ name: z.string().min(1), phone: z.string().optional(), email: z.string().optional() }))
  .handler(async ({ data }) => {
    const ds = await resolveDataSource();
    const result = await ds.suppliers.create(data);
    return { isTestUser: ds.isTestUser, result };
  });

export const getProductsFn = createServerFn({ method: "GET" }).handler(async () => {
  const ds = await resolveDataSource();
  const data = await ds.products.getAll();
  return { isTestUser: ds.isTestUser, data };
});

export const createProductFn = createServerFn({ method: "POST" })
  .inputValidator(z.object({ name: z.string().min(1), price: z.number(), category: z.string() }))
  .handler(async ({ data }) => {
    const ds = await resolveDataSource();
    const result = await ds.products.create(data);
    return { isTestUser: ds.isTestUser, result };
  });

export const getInvoicesFn = createServerFn({ method: "GET" }).handler(async () => {
  const ds = await resolveDataSource();
  const data = await ds.invoices.getAll();
  return { isTestUser: ds.isTestUser, data };
});

export const createInvoiceFn = createServerFn({ method: "POST" })
  .inputValidator(z.object({ customer: z.string().min(1), amount: z.number() }))
  .handler(async ({ data }) => {
    const ds = await resolveDataSource();
    const result = await ds.invoices.create(data);
    return { isTestUser: ds.isTestUser, result };
  });

export const getExpensesFn = createServerFn({ method: "GET" }).handler(async () => {
  const ds = await resolveDataSource();
  const data = await ds.expenses.getAll();
  return { isTestUser: ds.isTestUser, data };
});

export const getStaffFn = createServerFn({ method: "GET" }).handler(async () => {
  const ds = await resolveDataSource();
  const data = await ds.staff.getAll();
  return { isTestUser: ds.isTestUser, data };
});

export const getPayrollFn = createServerFn({ method: "GET" }).handler(async () => {
  const ds = await resolveDataSource();
  const data = await ds.payroll.getAll();
  return { isTestUser: ds.isTestUser, data };
});

export const getStoresFn = createServerFn({ method: "GET" }).handler(async () => {
  const ds = await resolveDataSource();
  const data = await ds.stores.getAll();
  return { isTestUser: ds.isTestUser, data };
});

export const getTransfersFn = createServerFn({ method: "GET" }).handler(async () => {
  const ds = await resolveDataSource();
  const data = await ds.transfers.getAll();
  return { isTestUser: ds.isTestUser, data };
});

export const getLeaveRequestsFn = createServerFn({ method: "GET" }).handler(async () => {
  const ds = await resolveDataSource();
  const data = await ds.leaveRequests.getAll();
  return { isTestUser: ds.isTestUser, data };
});

export const getChartOfAccountsFn = createServerFn({ method: "GET" }).handler(async () => {
  const ds = await resolveDataSource();
  const data = await ds.chartOfAccounts.getAll();
  return { isTestUser: ds.isTestUser, data };
});

export const getPaymentVouchersFn = createServerFn({ method: "GET" }).handler(async () => {
  const ds = await resolveDataSource();
  const data = await ds.paymentVouchers.getAll();
  return { isTestUser: ds.isTestUser, data };
});
