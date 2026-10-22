# Free pilot hosting

**Status**: In Progress

## Summary

Deploy the existing TanStack Start application on Vercel and use Supabase PostgreSQL through its transaction pooler. This is the fastest path because the repository already targets Vercel and Nitro, and both services can run in Frankfurt. Vercel Hobby is limited to noncommercial development and UAT, so real pharmacy operation requires Vercel Pro or another commercial hosting plan.

## Context

The application is already a full stack TanStack Start system with Nitro server functions, PostgreSQL, Drizzle, cookie authentication, migrations, and operational checks. Login cannot work without a reachable PostgreSQL database. The immediate need is a public deployment that costs nothing and supports commercial use.

The system handles pharmacy, customer, staff, inventory, and sales information. Secrets must remain server side. Production data must not be placed on the pilot until access, backups, restore, and acceptance checks are proven.

## Requirements

**User stories**:

* As an administrator, I want to sign in to the hosted application so that I can operate the ERP from an internet connected browser.
* As an operator, I want deployment checks to fail clearly when configuration or the database is unavailable so that a broken release is not mistaken for a working one.

**Acceptance criteria**:

* **AC-1**: Vercel builds and serves the complete TanStack Start application, including server functions and browser routes.
* **AC-2**: The hosted application connects to Supabase through a transaction pooler `DATABASE_URL`, with no database secret in the browser bundle or repository.
* **AC-3**: Migrations, seed, login verification, preflight, tests, type checking, and production build pass against the target database.
* **AC-4**: The configured active administrator can sign in, receive the secure authentication cookie, open a protected route, and sign out.
* **AC-5**: Invalid credentials return the generic invalid credentials message, while unavailable infrastructure is recorded in server logs without exposing secrets.
* **AC-6**: Hosting limits and the required upgrade point are documented before real pharmacy use.

## Options considered

### Option 1: Netlify and Supabase

Netlify runs the existing full stack build and permits commercial projects on its free plan. Supabase provides persistent PostgreSQL and pooled connections.

**Pros**:

* Minimal application change
* Free commercial pilot path
* Managed TLS, deployment, and persistent PostgreSQL

**Cons**:

* Free quotas can pause the application
* Neon can add wake latency after inactivity
* No uptime commitment

### Option 2: Vercel and Supabase

Vercel has direct TanStack Start and Nitro support.

**Pros**:

* Existing repository configuration already targets Vercel
* Strong framework integration

**Cons**:

* Vercel Hobby is limited to personal and noncommercial use
* Commercial pharmacy use requires a paid plan

### Option 3: Render and Neon

Render can run the application as a Node web service.

**Pros**:

* Simple conventional server runtime
* Free preview service exists

**Cons**:

* Free services sleep after inactivity and can take about one minute to wake
* Render states free services are not for production applications

## Decision

**Chosen option**: Option 2, Vercel and Supabase

Keep the current architecture and deploy it to Vercel `fra1` with a Supabase Frankfurt transaction pooler connection. Use Vercel Hobby only for noncommercial development and UAT. Upgrade the hosting plan before real commercial pharmacy operation.

## Rationale

Vercel is the fastest delivery path because the existing Nitro integration and `vercel.json` already target it, and Vercel officially supports TanStack Start. Supabase preserves the PostgreSQL contract already used throughout the application. Matching Frankfurt regions avoids avoidable database round trips. This accepts one firm boundary: free Vercel hosting is for development and UAT only, not live commercial pharmacy use.

## Feature design

**Data model sketch**:

No schema redesign is required. Existing ordered migrations remain the source of truth.

**API surface**:

| Surface | Method | Key inputs | Key outputs | Auth | Key errors |
|---|---|---|---|---|---|
| `loginUserFn` | POST | username, password | success, user, message, auth cookie | Public | invalid credentials, database unavailable |
| `getCurrentUserFn` | GET | auth cookie | current user or null | Cookie | invalid or inactive session |
| `logoutUserFn` | POST | auth cookie | success | Cookie | cookie context failure is handled |

**Value sourcing**:

| Action | Value produced or displayed | Source |
|---|---|---|
| Login | Account and role | PostgreSQL `users` row |
| Login | Password result | Bcrypt comparison against `password_hash` |
| Login | Session identity | Signed JWT using server side `JWT_SECRET` |
| Database connection | Target database | Server side `DATABASE_URL` |

**Key invariants**:

* Browser code never receives database or JWT secrets.
* Only active, non test accounts can sign in.
* The hosted database is migrated and checked before users enter data.
* The administrator password is rotated after first hosted sign in.

**Security model**:

The current HTTP only cookie and server role checks remain authoritative. Health and error output must never include connection strings, passwords, hashes, tokens, or customer information.

**Configuration required**:

* `DATABASE_URL`: Supabase transaction pooler connection URL
* `JWT_SECRET`: unique hosted secret with at least 32 characters
* `DB_POOL_MAX`: conservative serverless pool size
* `NODE_ENV`: `production`
* `ADMIN_USERNAME`, `ADMIN_EMAIL`, `ADMIN_PASSWORD`, `BUSINESS_NAME`: operator values used only during controlled seed

**Critical test scenarios**:

* Happy path: migrate, seed, verify login, deploy, sign in, open a protected route, and sign out, verifies **AC-1**, **AC-2**, **AC-3**, and **AC-4**.
* Failure case: use an unreachable database and confirm a safe user message plus useful server log, verifies **AC-5**.
* Auth case: use a wrong password and an inactive account and confirm neither receives a session, verifies **AC-4** and **AC-5**.
* Operations case: review quota and recovery notes before live data approval, verifies **AC-6**.

## Build plan

1. Configure the local ignored `.env` and make missing server configuration fail clearly, satisfies **AC-2** and **AC-5**.
2. Validate the existing Vercel and Nitro deployment configuration, satisfies **AC-1**.
3. Provision Supabase in Frankfurt, set the transaction pooler `DATABASE_URL`, and apply migrations and seed from a trusted operator machine, satisfies **AC-2** and **AC-3**.
4. Run login verification, preflight, tests, type checking, and production build, satisfies **AC-3** and **AC-5**.
5. Deploy to Vercel and perform the hosted login and protected route check, satisfies **AC-1** and **AC-4**.
6. Record free tier limits, backup steps, and the upgrade trigger, satisfies **AC-6**.

## Consequences

**Positive**:

* The existing application and PostgreSQL model are reused.
* The pilot can be hosted without an initial hosting bill.

**Negative and tradeoffs**:

* Free plans can pause or throttle the application.
* Support, monitoring history, recovery guarantees, and uptime are limited.
* A paid service is required when the pharmacy depends on continuous availability.

**Neutral**:

* The current Vercel deployment configuration remains in place.
* Local development can continue using PostgreSQL on `localhost`.

## Follow-up

* [ ] Create the Supabase and Vercel projects and connect the repository.
* [ ] Rotate the administrator password and hosted JWT secret after initial verification because the current values were shared in chat.
* [ ] Complete a backup restore drill before entering real pharmacy data.

## References

**Project sources**:

* `ARCHITECTURE.md`
* `OPERATIONS.md`
* `PRODUCTION_READINESS.md`

**Links**:

* Netlify pricing: https://www.netlify.com/pricing/
* Netlify TanStack Start guide: https://docs.netlify.com/build/frameworks/framework-setup-guides/tanstack-start/
* Supabase project pausing: https://supabase.com/docs/guides/platform/free-project-pausing
* Supabase database connections: https://supabase.com/docs/guides/database/connecting-to-postgres
* Vercel function regions: https://vercel.com/docs/functions/configuring-functions/region
* Vercel terms: https://vercel.com/legal/terms
* Render free service limits: https://render.com/docs/free

## Migration plan

**Strategy**: Direct hosting target change with no data migration

**Phases**:

1. Prove local login and the production build.
2. Prepare the Vercel deployment and verify it without real pharmacy data.
3. Migrate and seed Neon, then run all checks and hosted acceptance.

**Rollback**: Roll back to the last successful Vercel deployment and point a trusted environment back to the last verified database if needed.

**Risks**: Provider quotas, cold starts, incorrect environment scope, and operating without a tested database restore.
