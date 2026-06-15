# AIFlashcards - Agent Guide

This file is the operating guide for OpenCode and other AI agents working in this repo. Keep it concise and durable. Put changing implementation status in `docs/REPO_STATE.md`, not here.

## Read First

1. `AGENTS.md` for workflow and conventions.
2. `docs/REPO_STATE.md` for current implementation status.
3. `docs/DECISIONS.md` for accepted clarifications and spec deviations.
4. Relevant source files before editing.

Historical guidance referenced `PRD_UI_SPEC.md` and `IMPLEMENTATION_SPEC.md`, but those files are not currently present in the workspace. If they are restored, update this section and the source-of-truth hierarchy below.

## Source Of Truth

When documents or assumptions conflict, use this order:

1. Implemented source code, tests, migrations, and configuration files.
2. `docs/DECISIONS.md` for intentional deviations and clarifications.
3. `docs/REPO_STATE.md` for current status and known gaps.
4. `AGENTS.md` for durable workflow and convention rules.
5. `README.md` for onboarding summaries.

If restored later, product and implementation specs should sit below accepted decisions and above summary docs.

## Stack

| Layer | Choice |
|-------|--------|
| Framework | Next.js App Router |
| UI | Tailwind CSS + shadcn-style primitives |
| Database | Supabase Postgres with RLS migrations |
| Auth | Supabase Auth via `@supabase/ssr` |
| AI | OpenRouter API |
| Client state | SWR |
| Validation | Zod |
| Testing | Vitest + React Testing Library + jsdom |
| Deploy | Vercel target, Supabase CLI for local dev |

## Core Routes

| Path | Auth | Purpose |
|------|------|---------|
| `/login` | Public, redirects if authenticated | Login/register |
| `/dashboard` | Protected | Deck grid |
| `/decks/[id]` | Protected | Deck detail and cards |
| `/study/[id]` | Protected | Study flow |

`middleware.ts` protects dashboard/deck/study routes and redirects authenticated users away from `/login`.

## Non-Negotiable Conventions

- Keep the UI dark-mode only with the established deep violet visual direction.
- Use App Router patterns for pages, layouts, route handlers, and middleware.
- Use Supabase SSR/session helpers for authenticated server access.
- Use Zod schemas from `lib/validations.ts` for request and form validation.
- Use SWR keys from `lib/swr-keys.ts`; do not invent competing key strings.
- Keep shared `Deck` and `Card` interfaces in `lib/types.ts`.
- Keep shadcn-style primitives in `components/ui/`.
- Keep tests co-located as `*.test.tsx` or `*.test.ts` near the code they cover.
- Return API errors as `{ error: string }`.
- Do not commit secrets from `.env.local` or Supabase local temp files.

## Implementation Order

Use this sequence when adding missing work or assessing progress:

1. Foundation: Next.js, Tailwind, UI primitives, Supabase clients, middleware, migrations.
2. Auth: login/register pages and session handling.
3. Decks: dashboard, CRUD API routes, and deck components.
4. Cards: deck detail, card CRUD, and card components.
5. AI Generate: OpenRouter route and AI generation UI.
6. Study: study view, flip card, progress, and summary.
7. Polish: error boundaries, loading skeletons, responsive states, empty states, and tests.

## Commands

- `npm run dev` starts the Next.js dev server.
- `npm run build` builds the app.
- `npm run start` starts the production server after a build.
- `npm run lint` runs ESLint.
- `npm test` runs Vitest.
- `npm run test:e2e` runs Playwright smoke E2E tests.
- `npm run test:e2e:ui` opens the Playwright UI runner.
- `supabase start` starts local Supabase when the CLI is available.
- `supabase db push` applies migrations to the configured Supabase database.

## Environment Variables

Keep `.env.example` current. Required variables are:

```env
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
OPENROUTER_API_KEY=
OPENROUTER_MODEL=openai/gpt-4o-mini
OPENROUTER_BASE_URL=https://openrouter.ai/api/v1
SUPABASE_SERVICE_ROLE_KEY=
```

## Agent Workflow

Before changing code:

- Read `docs/REPO_STATE.md`.
- Check `docs/DECISIONS.md` for relevant accepted decisions.
- Search existing code before creating new patterns.
- Prefer the smallest correct change.

During changes:

- Reuse existing schemas, types, SWR keys, components, and Supabase helpers.
- Avoid broad rewrites unless the user requests them or the existing design blocks the task.
- Preserve unrelated user or agent changes in the worktree.

After changes:

- Run the most relevant tests or checks that are feasible.
- Update `docs/REPO_STATE.md` when implementation status changes.
- Update `docs/CHANGELOG.md` for completed work.
- Update `docs/DECISIONS.md` only for durable decisions, clarifications, or intentional deviations.
- Update `.env.example` when environment variables change.
- Update `README.md` only when onboarding, setup, or commands change.
- Update `AGENTS.md` only when agent workflow or durable conventions change.

## Docs To Avoid For Now

- Do not create separate API reference docs until routes stabilize or docs can be generated from code.
- Do not create component docs or Storybook docs until there is a real maintenance need.
- Do not create public user docs, versioned docs, or a docs site while the product is still pre-release.
