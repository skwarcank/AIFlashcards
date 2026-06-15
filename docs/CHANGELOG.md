# Changelog

This is a lightweight implementation history for humans and agents. It records completed work, not design rationale.

## Unreleased

### Added

- Added documentation strategy files: `README.md`, `docs/REPO_STATE.md`, `docs/DECISIONS.md`, and `docs/CHANGELOG.md`.
- Added documentation maintenance rules to keep volatile state separate from durable agent instructions.
- Added Vitest one-shot, watch, coverage, and typecheck scripts with V8 coverage support.
- Added shared test utilities for rendering, factories, fetch mocks, navigation mocks, and Supabase query/client mocks.
- Added middleware auth redirect and auth-check failure tests.
- Added GitHub Actions CI for lint, typecheck, Vitest, Playwright smoke E2E, and production build checks.
- Added API route tests for `/api/generate` and `/api/decks`.
- Added nested API route tests for deck update/delete, card list/create/batch create, individual card update/delete, and study completion.
- Added component interaction tests for deck creation, rename, delete confirmation, and manual card creation forms.
- Added component interaction tests for card row actions, edit card modal behavior, and AI generation review/add/rate-limit flows.
- Added container interaction tests for dashboard deck create/delete flows and deck detail load/rename/edit/delete/retry flows.
- Added a study view interaction test for progress, scoring, completion, and navigation callbacks.
- Added Playwright E2E smoke setup for login rendering and unauthenticated protected-route redirects.

### Changed

- Refocused `AGENTS.md` as an AI agent operating guide instead of a broad project snapshot.
- Updated `.env.example` with default OpenRouter values.
- Made test cleanup work in both jsdom and node Vitest environments.
- Added shared `matchMedia`, `ResizeObserver`, and `IntersectionObserver` mocks to the Vitest setup.
- Adjusted i18n language initialization and auth form hook dependencies to satisfy lint/type validation.
