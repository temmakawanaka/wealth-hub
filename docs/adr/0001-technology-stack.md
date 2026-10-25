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
- **CI now:** Node 22 built-in test runner, syntax checks, hygiene verification, CodeQL, dependency review, and Dependabot for GitHub Actions.
- **Infrastructure / deployment:** Deferred. Do not introduce paid cloud infrastructure or secrets at this stage.

## Why staged migration?

The existing demo has no third-party runtime or development dependencies. Keeping the current JavaScript working while adding lightweight gates avoids landing a large, unverified toolchain migration. Introduce package lockfiles and dependency scanning for npm packages as soon as npm dependencies are added.

## Security boundaries

All current financial figures are fictional. Never include bank credentials, card details, account identifiers, customer data, access tokens or real balances in source control. Frontend validation is not authorization. Later integrations require a provider-by-provider API and terms review, a threat model, and tests for cross-user data access.

## Next steps

1. Move the demo to Vite + React + strict TypeScript in a self-contained PR with lockfile and reproducible `npm ci`.
2. Add ESLint, Prettier, Vitest, and automated formatting and type checks.
3. Define API/domain schemas before provisioning AWS.
4. Add Playwright smoke tests once the UI is stable.
