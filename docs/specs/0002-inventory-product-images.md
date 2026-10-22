# 0002 · Inventory product images

**Status**: Assumed
**Date**: 2026-10-22
**Authorized by**: Product owner, during /develop

## Owed decision

Choose permanent product image storage and define how inventory, package units, barcodes, POS display, and bilingual labels work together.

## Assumption built on

Use a public `product-images` bucket in the existing Supabase project. Upload validated JPEG, PNG, or WebP files through a server function with the Supabase secret key. Store only the public image URL in the existing `products.image` column. Keep the existing barcode, purchase unit, selling unit, and units per purchase unit columns. Product creation starts with empty fields and stock remains an audited inventory action.

## Code area

`src/lib/api/domain.ts`, `src/routes/_app.products.catalog.tsx`, `src/routes/_app.store.stock.tsx`, `src/routes/_app.pos.tsx`, `src/components/erp/AppSidebar.tsx`, `src/components/erp/Topbar.tsx`, and `src/lib/i18n.ts`.

## Requirements

AC 1. A user can add a product from Inventory with an optional permanent image.

AC 2. The same image appears in the Inventory table and POS product grid.

AC 3. Barcode and package to selling unit conversion are clear and stored with the product.

AC 4. New product fields start empty and use clear labels and helper text.

AC 5. The language control is a dropdown and the changed inventory, POS, navigation, and forms render in English or Kiswahili.

AC 6. Images are resized by the browser before upload and lazy loaded where possible.

## Build plan

- [x] Add secure Supabase Storage upload support. Satisfies AC 1, AC 2, AC 6.
- [x] Rebuild the product form and inventory table. Satisfies AC 1, AC 2, AC 3, AC 4.
- [x] Group the requested sidebar modules and localize navigation. Satisfies AC 5.
- [x] Make the language control a dropdown and localize inventory and POS. Satisfies AC 5.
- [ ] Run typecheck, tests, build, and deployment checks. Satisfies AC 1 to AC 6.

## Ratify

This decision was recorded by `/develop`, not deliberated. Run `/architect inventory product images` to deliberate and ratify it later. Until then it stays flagged as an owed decision.
