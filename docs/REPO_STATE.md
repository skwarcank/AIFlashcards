# Repo State

Last updated: 2026-06-15

## Current Phase

Implementation is in progress and appears to be in the polish/tests phase. Foundation, auth, decks, cards, AI generation, and study flows have code present.

## Implemented

- Next.js App Router project structure with `app/layout.tsx`, `app/page.tsx`, `app/login/page.tsx`, and dashboard route group.
- Protected route middleware for `/dashboard`, `/decks`, and `/study`, with authenticated-user redirects away from `/login`.
- Supabase clients under `lib/supabase/` for browser, server, and admin usage.
- Database migrations under `supabase/migrations/` for decks/cards schema and card ownership.
- Shared types in `lib/types.ts` for `Deck` and `Card`.
- Shared Zod schemas in `lib/validations.ts` for login, register, deck, card, and AI generation payloads.
- SWR key helpers in `lib/swr-keys.ts`.
- Auth forms with co-located tests.
- Dashboard, deck detail, card management, AI generation, and study UI components.
- API routes for deck CRUD, card CRUD, batch card creation, study deck loading, and AI generation.
- Dark violet global UI background in `app/layout.tsx`.
- Vitest configuration, coverage reporting, shared test utilities, and cleanup setup.
- Middleware auth redirect/error tests for protected routes and `/login`.
- GitHub Actions CI workflow for lint, typecheck, Vitest, Playwright smoke E2E, and production build checks.
- API route tests for `/api/generate` and `/api/decks` covering validation, auth, OpenRouter, Supabase, and error paths.
- Nested API route tests for deck update/delete, card list/create/batch create, individual card update/delete, and study completion.
- Component interaction tests for deck creation, rename, delete confirmation, and manual card creation forms.
- Component interaction tests for card row edit/delete callbacks, edit card modal validation/save, and AI generation review/add/rate-limit flows.
- Container interaction tests for dashboard deck create/delete flows and deck detail load/rename/edit/delete/retry flows.
- Study view interaction test covering progress, known-card scoring, completion, and back-to-deck callbacks.
- Playwright E2E smoke setup with unauthenticated Supabase auth mock coverage for login rendering and protected-route redirects.

## Not Yet Confirmed

- Whether every UI flow has been manually tested against a running Supabase instance.
- Whether migrations fully match the latest API assumptions in all environments.
- Whether all originally planned product/spec requirements are still available, because `PRD_UI_SPEC.md` and `IMPLEMENTATION_SPEC.md` are not present in the workspace.
- Whether deployment settings on Vercel have been configured.

## Known Gaps And Risks

- Historical guidance referenced `PRD_UI_SPEC.md` and `IMPLEMENTATION_SPEC.md`, but those files are currently missing from the repo. Treat implemented code plus this docs set as the available context until specs are restored.
- `.env.local` exists locally and must not be committed.
- Generated build artifacts such as `.next/` and `tsconfig.tsbuildinfo` exist locally; avoid treating them as source files.
- AI generation returns empty suggestions when no OpenRouter API key is configured, which is intentional development behavior in the current code.
- Database/RLS integration tests are still pending.
- Authenticated browser-level E2E coverage for full auth/deck/card/study journeys is still pending; it needs local Supabase seeded users or a dedicated test auth strategy because middleware validates sessions server-side.
- Coverage thresholds are not enforced yet; add them after API and core UI coverage are broader.

## Confirmed Commands

- `npm run dev` starts the Next.js dev server.
- `npm run build` builds the Next.js app.
- `npm run start` starts the production server after a build.
- `npm run lint` runs ESLint.
- `npm test` runs Vitest in watch mode.
- `npm run test:run` runs Vitest once.
- `npm run test:coverage` runs Vitest with V8 coverage reporting.
- `npm run test:e2e` runs Playwright smoke E2E tests.
- `npm run test:e2e:ui` opens the Playwright UI runner.
- `npm run typecheck` runs TypeScript with `--noEmit`.

## Documentation Maintenance

- Update this file when implementation status changes.
- Update `docs/CHANGELOG.md` for completed work.
- Update `docs/DECISIONS.md` for durable decisions, clarifications, or intentional deviations.
- Update `.env.example` when environment variables change.
- Update `README.md` only when onboarding, setup, or commands change.
- Update `AGENTS.md` only when agent workflow or durable conventions change.
