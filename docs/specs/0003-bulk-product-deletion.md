# 0003 · Bulk product deletion

**Status**: Assumed
**Date**: 2026-10-22
**Authorized by**: Product owner, during /develop

## Owed decision

Define permanent product deletion behavior without breaking inventory and accounting history.

## Assumption built on

Admin and SuperAdmin users can select one or many products under Inventory, Manage items, and request deletion. A product is permanently deleted only when its stock is zero and it has no batch, sale, purchase order, or inventory movement references. Referenced products are preserved and returned as blocked items with a clear reason. Every successful deletion is written to the audit log. Demo users cannot delete products.

## Code area

`src/lib/api/domain.ts`, `src/routes/_app.products.catalog.tsx`, `src/components/erp/DataTable.tsx`, and `src/lib/i18n.ts`.

## Requirements

AC 1. Admin users can select individual products or select all products on Manage items.

AC 2. A user can delete one item from its row or delete the selected items in one action.

AC 3. The interface requires confirmation and reports deleted and blocked products separately.

AC 4. Products with stock or historical references cannot be deleted.

AC 5. Successful deletions are audited and immediately removed from the table.

AC 6. Controls and feedback work in English and Kiswahili.

## Ratify

This decision was recorded by `/develop`, not deliberated. Run `/architect bulk product deletion` to deliberate and ratify it. Until then it stays flagged as an owed decision.
