# Protected user administration

**Status**: In Progress

## Summary

Separate the platform owner from pharmacy administrators. SuperAdmin accounts are invisible and unreachable to lower roles. SuperAdmin can manage pharmacy owners and staff, while an Admin can manage ordinary staff only.

## Requirements

**User stories**:

* As the system owner, I want lower roles to be unable to view or change my account.
* As SuperAdmin, I want to create, edit, reset, deactivate, and remove pharmacy user accounts.
* As a pharmacy Admin, I want to create, edit, reset, deactivate, and remove staff login accounts without gaining control over platform or owner accounts.

**Acceptance criteria**:

* **AC-1**: Admin list and audit responses contain no SuperAdmin account details.
* **AC-2**: Server authorization rejects every Admin attempt to view or mutate SuperAdmin or Admin accounts.
* **AC-3**: SuperAdmin can create and manage Admin and staff accounts, but cannot remove, deactivate, or demote their own active SuperAdmin account.
* **AC-4**: Admin can create and manage Pharmacist, Cashier, Storekeeper, and Accountant accounts only.
* **AC-5**: Edit supports username, email, role, and department with uniqueness and role hierarchy validation.
* **AC-6**: Remove immediately blocks login and hides the account while preserving the user identifier required by sales and audit history.
* **AC-7**: The user interface provides clear edit, password reset, activation, and removal actions in English and natural Tanzanian Swahili.

## Decision

Use server enforced role hierarchy and archived removal. SuperAdmin is the platform owner. Admin is the pharmacy owner. Staff roles are Pharmacist, Cashier, Storekeeper, and Accountant. A removed account is anonymised and marked `Removed` instead of deleting its database row, preserving accounting and audit references.

## Feature design

**Data model**:

No migration is required. The existing user status stores `Removed`. Removal replaces username and email with non identifying unique values, clears department, changes the password hash, and retains the row id and role for historical foreign keys.

**API surface**:

| Surface | Inputs | Result | Authorization |
|---|---|---|---|
| `getUsersFn` | session | visible active and inactive accounts | SuperAdmin sees non removed accounts; Admin never receives SuperAdmin or Admin rows |
| `createUserFn` | account fields | created account | SuperAdmin may create Admin or staff; Admin may create staff only |
| `updateUserFn` | user id and editable fields | updated account | hierarchy checked against the stored target role |
| `setUserStatusFn` | user id and status | success | hierarchy checked; self deactivation rejected |
| `resetUserPasswordFn` | user id and password | success | hierarchy checked |
| `removeUserFn` | user id | success | hierarchy checked; self removal rejected; row anonymised and archived |
| `getAuditLogsFn` | session | recent visible events | Admin receives no event that exposes a protected account |

**Security model**:

Authorization uses the authenticated actor and the target row loaded from the database. Client supplied roles are never trusted for permission checks. UI hiding is only presentation and does not replace API enforcement.

**Key invariants**:

* No lower role can enumerate, infer, edit, reset, deactivate, or remove a SuperAdmin account.
* Admin cannot manage another Admin account.
* The signed in SuperAdmin cannot remove, deactivate, or demote themselves.
* Removed credentials cannot authenticate.
* Every account mutation creates an audit entry without recording passwords.

**Value sourcing**:

| Value | Source |
|---|---|
| Actor role and id | authenticated database backed session |
| Target role and status | current `users` database row |
| Available role choices | server returned actor capability |
| Visible account rows | server filtered query |

## Build plan

1. Add reusable server role hierarchy checks and tests, satisfies **AC-1**, **AC-2**, **AC-3**, and **AC-4**.
2. Add edit and archived removal APIs with audited mutations, satisfies **AC-5** and **AC-6**.
3. Filter account and audit reads so Admin never receives protected details, satisfies **AC-1** and **AC-2**.
4. Add responsive account actions and accessible edit, password, and removal forms, satisfies **AC-5** and **AC-7**.
5. Add English and Tanzanian Swahili copy and run tests, type checking, and production build, satisfies **AC-7**.

## Consequences

Historical transactions keep their user references after account removal. The system currently represents one pharmacy data space per deployment. Supporting several unrelated pharmacies in one database will require a later organisation id and tenant scoping design.

## Rollback

Revert the application release. Archived users remain safely unable to sign in and can be restored only through a deliberate administrator operation.
