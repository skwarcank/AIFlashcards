# AIFlashcards

AIFlashcards is a Next.js flashcard app with Supabase-backed auth/data and an OpenRouter-powered card generation flow.

## Repo Status

Implementation is in progress. The app currently includes the Next.js foundation, Supabase auth helpers, protected routes, deck/card APIs, AI generation, study components, shadcn-style UI primitives, and Vitest setup.

See `docs/REPO_STATE.md` for the current implementation snapshot.

## Documentation Map

| File | Purpose |
|------|---------|
| `AGENTS.md` | Operating rules for OpenCode and other AI agents |
| `docs/REPO_STATE.md` | Current implementation status and known gaps |
| `docs/DECISIONS.md` | Durable decisions, clarifications, and spec deviations |
| `docs/CHANGELOG.md` | Lightweight implementation history |
| `.env.example` | Required environment variables |

If product or implementation specs are restored, link them here and treat them as planning references. At the time of this update, `PRD_UI_SPEC.md` and `IMPLEMENTATION_SPEC.md` are referenced by older guidance but are not present in the workspace.

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
| Testing | Vitest + React Testing Library + jsdom + Playwright |

## Quick Start

1. Install dependencies with `npm install`.
2. Copy `.env.example` to `.env.local` and fill in real values.
3. Start local Supabase with `supabase start` if using the local database.
4. Apply migrations with `supabase db push` or the appropriate Supabase workflow.
5. Run the app with `npm run dev`.
6. Run unit/component/API tests with `npm test` or `npm run test:run`.
7. Run browser smoke tests with `npm run test:e2e`.

## Agent Workflow

Before changing code, read `AGENTS.md` and `docs/REPO_STATE.md`. After changing code, update only the docs affected by the change.
