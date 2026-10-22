# Configurable module permissions

**Status**: Implemented

## Summary

Give SuperAdmin a dashboard matrix for switching application modules on or off by role or by individual user. The same decision controls sidebar visibility, direct page access, and server operations.

## Requirements

**Acceptance criteria**:

* **AC-1**: Only SuperAdmin can view or change permission settings.
* **AC-2**: SuperAdmin can enable or disable Dashboard, Point of Sale, Stakeholders, Sales, Inventory, Procurement, Human Resource, and Administration for each non SuperAdmin role.
* **AC-3**: SuperAdmin can add a user specific override or return that user to the role default.
* **AC-4**: Disabled modules disappear from desktop and mobile navigation immediately after the next page load.
* **AC-5**: Opening a disabled route directly returns an access denied screen and protected server mutations reject the request.
* **AC-6**: SuperAdmin always retains every module and cannot lock the platform owner out.
* **AC-7**: The permissions interface and access messages are available in English and natural Tanzanian Swahili.

## Decision

Use deny capable role defaults plus optional user overrides stored in PostgreSQL. User overrides take precedence over role settings. SuperAdmin bypasses stored rules and always has full access. A shared module registry maps navigation groups and route prefixes to stable permission keys.

## Feature design

**Data model**:

* `role_module_permissions`: role, module key, enabled, updated by, updated time, unique role and module.
* `user_module_permissions`: user id, module key, enabled, updated by, updated time, unique user and module.

**Permission resolution**:

1. SuperAdmin receives all modules.
2. A matching user override wins.
3. A stored role setting is used.
4. A safe built in role default is used for rows not configured yet.

**Security model**:

The server computes effective permissions from the authenticated database user. The browser receives only the effective module key list. Permission management endpoints require SuperAdmin. Route checks improve navigation security and every protected server API uses the same module guard.

**Value sourcing**:

| Value | Source |
|---|---|
| Module names and route mapping | versioned application module registry |
| Role setting | `role_module_permissions` |
| User override | `user_module_permissions` |
| Effective access | deterministic server resolver |

## Build plan

1. Add permission tables and module registry, satisfies **AC-2**, **AC-3**, and **AC-6**.
2. Add effective permission resolution and SuperAdmin only management APIs, satisfies **AC-1**, **AC-2**, **AC-3**, and **AC-6**.
3. Enforce permissions in the application route boundary and server APIs, satisfies **AC-5**.
4. Filter desktop and mobile navigation using effective permissions, satisfies **AC-4**.
5. Add a role and user permission matrix to the SuperAdmin dashboard with bilingual copy, satisfies **AC-1**, **AC-2**, **AC-3**, and **AC-7**.
6. Apply and inspect the migration, then run tests, type checking, and production build.

## Consequences

Changing access becomes a normal SuperAdmin task instead of a code deployment. Module permissions control broad areas. Fine grained actions such as only viewing stock but not adjusting it can be added later with action permission keys using the same model.

## Rollback

Revert the application release. Permission tables may remain because older application versions ignore them. SuperAdmin bypass ensures recovery access.
