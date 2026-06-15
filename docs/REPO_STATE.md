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
- Vitest configuration and test setup.

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

## Confirmed Commands

- `npm run dev` starts the Next.js dev server.
- `npm run build` builds the Next.js app.
- `npm run start` starts the production server after a build.
- `npm run lint` runs ESLint.
- `npm test` runs Vitest.

## Documentation Maintenance

- Update this file when implementation status changes.
- Update `docs/CHANGELOG.md` for completed work.
- Update `docs/DECISIONS.md` for durable decisions, clarifications, or intentional deviations.
- Update `.env.example` when environment variables change.
- Update `README.md` only when onboarding, setup, or commands change.
- Update `AGENTS.md` only when agent workflow or durable conventions change.
