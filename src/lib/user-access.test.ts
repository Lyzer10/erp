import assert from "node:assert/strict";
import test from "node:test";
import { canAssignRole, canManageRole } from "./user-access";

test("SuperAdmin manages lower roles but not another SuperAdmin", () => {
  assert.equal(canManageRole("SuperAdmin", "Admin"), true);
  assert.equal(canManageRole("SuperAdmin", "SuperAdmin"), false);
});

test("Admin manages staff only", () => {
  assert.equal(canManageRole("Admin", "Cashier"), true);
  assert.equal(canManageRole("Admin", "Admin"), false);
  assert.equal(canManageRole("Admin", "SuperAdmin"), false);
});

test("role assignment follows the same hierarchy", () => {
  assert.equal(canAssignRole("Admin", "Admin"), false);
  assert.equal(canAssignRole("Admin", "Pharmacist"), true);
  assert.equal(canAssignRole("SuperAdmin", "Admin"), true);
  assert.equal(canAssignRole("SuperAdmin", "SuperAdmin"), false);
});
