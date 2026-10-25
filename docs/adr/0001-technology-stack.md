# ADR 0001: TypeScript-first application architecture

- Status: Accepted; frontend and development tooling adopted, backend deferred
- Date: 2026-10-25

## Context

The project is a synthetic-data-only personal finance prototype. Development foundations, correctness and security come before new screens. No financial accounts or production cloud resources are connected.

## Adopted

- Application language: strict TypeScript.
- Frontend: React + Vite.
- Application unit tests: Vitest, scoped to `src`.
- Development-tool tests: Node.js built-in test runner, scoped to `scripts/tooling.test.mjs`.
- Style and static checks: ESLint + Prettier.
- Supported development environment: Node.js 22.x, at least 22.12.0, and npm 10.x. `.nvmrc` selects the Node line; `verify:env` enforces the policy. Package engines describe the dependency minimum, not support for every subsequent major.
- Dependencies: committed npm lockfile and `npm ci`; no dependency changes are needed for the tooling scripts.
- CI: the same `npm run check` command on Linux and Windows, with a fail-closed `quality` aggregation job.
- Security checks: CodeQL, npm audit, filename/line-ending hygiene checks, and Dependabot update proposals. These do not guarantee the absence of secrets or vulnerabilities.

## Deferred

- Secret content scanning: #14.
- Dependency Review and Actions pinning: #15.
- Coverage gate: #16.
- Development/build CSP separation and browser E2E: #17 and #18.
- Server-enforced branch protection and required status checks: #19; workflow changes do not configure repository settings.
- Domain/schema design: #20.
- Cognito Authorization Code + PKCE, API authorization and threat model: #21.
- TypeScript API contract and in-memory backend: #22.
- Import and provider-integration research: #23.
- AWS infrastructure and deployment planning: #24, deliberately deferred.

The planned backend remains API Gateway + Lambda + DynamoDB with authorization on every operation. Do not distribute long-lived AWS credentials to the browser. Financial integration needs a provider-specific API, terms, authentication and cost review before implementation.

## Security boundaries

All financial examples are synthetic. Never commit credentials, account identifiers, statements or real balances. Validate external input at runtime as well as at the TypeScript boundary. User ownership must come from verified authentication, not an untrusted request body. Production rollout requires authorization tests, logging/redaction, encryption and recovery design.

## Verification and maintenance

See [CONTRIBUTING.md](../../CONTRIBUTING.md) for the shared local/CI commands. Keep the runtime, type definitions, version files, CI and documentation aligned when upgrading Node. Review Dependabot proposals rather than merging major changes automatically. Check every latest-head CI result before merging, including the separate CodeQL workflow.
