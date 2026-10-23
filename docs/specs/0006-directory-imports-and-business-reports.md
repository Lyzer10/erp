# Directory imports and business reports

**Status**: In Progress

## Summary

Add safe Excel workflows for customer and supplier directories, practical business reporting with date filters and Excel or PDF output, and an explicit save workflow for SuperAdmin module permissions.

## Requirements

**Acceptance criteria**:

* **AC-1**: Customer and supplier pages download a bilingual Excel template and export the current directory.
* **AC-2**: Administrators can preview and import valid Excel rows; invalid rows or duplicates are reported before any row is saved.
* **AC-3**: Reports can be filtered by start date, end date, and relevant status, with totals recalculated from the filtered rows.
* **AC-4**: The filtered sales report downloads as Excel and PDF.
* **AC-5**: The Reports page contains Sales, Purchases, Stock, and Financial Summary views using database values.
* **AC-6**: Permission switches are edited locally and written only after SuperAdmin presses Save Changes.
* **AC-7**: A successful permission save updates effective access, hides disabled navigation on the user's next navigation or login, and writes a useful audit entry containing the role or user and changed modules.
* **AC-8**: New controls, errors, templates, and report labels use English or natural Tanzanian Swahili according to the selected language.

## Decision

Reuse ExcelJS for browser generated `.xlsx` files and validated workbook parsing. Use jsPDF with AutoTable for client generated PDF reports. Keep report queries server side and return only authenticated business data. Batch permission changes through one transactional server call so Save Changes produces one coherent audit record.

## Feature design

**Directory workbook columns**: code, name, contact person, phone, email, status. Code is optional for new rows. Name is required. Status is Active or Inactive. Existing rows match by code, otherwise duplicate email or phone is rejected.

**Reports**:

* Sales: completed and voided receipts, customer, subtotal, discount, tax, total, date.
* Purchases: LPO, supplier, item count, total, status, date.
* Stock: SKU, product, category, quantity, cost, value, reorder state.
* Financial Summary: filtered sales, purchases, expenses, gross operating result, stock value.

**Security model**:

Directory import requires SuperAdmin or Admin plus Stakeholders access. Reports require Sales access. Permission reads and writes require SuperAdmin. Exports never contain password hashes, tokens, or hidden SuperAdmin data.

**Value sourcing**:

| Value | Source |
|---|---|
| Directory rows | customers and suppliers tables |
| Sales totals | completed sales within selected database date range |
| Purchase totals | purchase orders within selected database date range |
| Expense totals | approved expenses within selected database date range |
| Stock value | current product quantity multiplied by cost per selling unit |
| Effective module access | role permission plus user override resolver |

## Build plan

1. [x] Build shared customer and supplier workbook generation, parsing, validation, preview, and import APIs, satisfies **AC-1**, **AC-2**, and **AC-8**.
2. [x] Add directory import and export controls and preview interface, satisfies **AC-1**, **AC-2**, and **AC-8**.
3. [x] Add filtered business report query and Sales, Purchases, Stock, and Financial Summary views, satisfies **AC-3** and **AC-5**.
4. [x] Add Excel and PDF generation for the filtered sales report, satisfies **AC-4** and **AC-8**.
5. [x] Replace immediate permission mutations with staged edits and one audited Save Changes call, satisfies **AC-6** and **AC-7**.
6. [x] Run tests, type checking, and production build. Deployment remains the final release action.

## Consequences

Imports are capped to a reasonable row count and committed atomically. PDF generation adds a lazily loaded browser dependency. Reports are operational summaries, not statutory TRA tax returns or audited financial statements.

## Rollback

Revert the application release. Imported directory rows remain normal business records and can be deactivated. Permission data remains compatible with the previous resolver.
