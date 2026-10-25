# ADR 0001: TypeScript-first application architecture

- Status: Accepted (incremental adoption)
- Date: 2026-10-25

## Context

This repository starts with a minimal dependency-free JavaScript demo. The long-term goal is a personal finance dashboard that aggregates financial data safely. It is not yet connected to any financial accounts.

## Decision

- **Primary language:** TypeScript for frontend, backend, and shared domain types.
- **Frontend:** React + Vite when the demo is migrated.
- **Backend (later):** TypeScript-based AWS Lambda behind API Gateway. Enforce user authorization on every request.
- **Auth (later):** Amazon Cognito, Authorization Code Flow with PKCE. No long-lived AWS credentials in the browser.
- **Data (later):** DynamoDB, with isolation by authenticated user.
- **Tests (later):** Vitest for unit/integration and Playwright for browser E2E.
- **Style (later):** ESLint, Prettier, and TypeScript strict mode, introduced alongside the first TS migration PR.
- **CI now:** Node 22 built-in test runner, syntax checks, hygiene verification, CodeQL, Dependabot for GitHub Actions, and a dependency-review plan pending GitHub Dependency graph enablement.
- **Infrastructure / deployment:** Deferred. Do not introduce paid cloud infrastructure or secrets at this stage.

## Why staged migration?

The initial demo had no dependencies. The TypeScript/React/Vite migration introduces a committed npm lockfile and reproducible CI via npm ci.

## Security boundaries

All current financial figures are fictional. Never include bank credentials, card details, account identifiers, customer data, access tokens or real balances in source control. Frontend validation is not authorization. Later integrations require a provider-by-provider API and terms review, a threat model, and tests for cross-user data access.

## Next steps

1. Migrate the demo to Vite + React + strict TypeScript (completed in next PR).
2. ESLint, Prettier, Vitest and formatting/type checking (completed in next PR). Enable GitHub Dependency graph in repository security settings, then add PR dependency review.
3. Define API/domain schemas before provisioning AWS.
4. Add Playwright smoke tests once the UI is stable.
