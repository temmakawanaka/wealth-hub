# Security Policy

## Supported versions

This project is an early prototype; there is no production-ready supported release.

## Sensitive information

This repository is **public**. Do not open public issues or PRs containing passwords, API tokens, IAM keys, account identifiers, transaction histories, actual balances, or identifying personal information. Do not paste real credentials into demo data.

## Reporting vulnerabilities

For security issues, use the repository's private vulnerability reporting feature if enabled. Otherwise contact the maintainer privately through a previously established secure channel; do not disclose secrets in public GitHub issues.

## Security posture

- No financial accounts or real users are supported yet.
- Current demo data is synthetic and intentionally not persisted.
- CI includes tests, CodeQL analysis, dependency review, and checks for common credential filenames.
- These checks are defense in depth, **not** a guarantee that no secrets or vulnerabilities exist.
- Authorization, encryption, logging/redaction, dependency pinning, CSP, and backup/recovery must be re-evaluated before production rollout.

If you accidentally commit a secret, treat it as compromised and revoke/rotate it immediately; removing it from the repository history alone is insufficient.
