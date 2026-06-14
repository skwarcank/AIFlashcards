# AIFlashcards — Agent Guide

This repo contains specs only (no code committed yet). Two source-of-truth docs define everything:

- `PRD_UI_SPEC.md` — product requirements, user flows, UI design
- `IMPLEMENTATION_SPEC.md` — routes, schema, component tree, API contracts, conventions

## Stack (from spec)

| Layer | Choice |
|-------|--------|
| Framework | Next.js App Router |
| UI | Tailwind CSS + shadcn/ui |
| Database | Supabase Postgres with RLS |
| Auth | Supabase Auth (cookie-based SSR via `@supabase/ssr`) |
| AI | OpenRouter API (`openai/gpt-4o-mini` default) |
| Client state | SWR with defined key constants in `lib/swr-keys.ts` |
| Validation | Zod schemas in `lib/validations.ts` |
| Testing | Vitest + React Testing Library + jsdom |
| Deploy | Vercel + Supabase CLI for local dev |

## Route structure

| Path | Auth | Page |
|------|------|------|
| `/login` | Public (redirect if authed) | Login/Register |
| `/dashboard` | Protected | Deck grid |
| `/decks/[id]` | Protected | Deck detail + cards |
| `/study/[id]` | Protected | Study view |

`middleware.ts` checks Supabase session cookie. Errors return `{ error: string }`.

## Key conventions from spec

- **Dark mode only** — deep violet bg (`#1a0a2e`), accent `#7c3aed`
- **Forms** — use `react-hook-form` + Zod schemas (schemas defined in `lib/validations.ts`)
- **Data fetching** — SWR with keys from `lib/swr-keys.ts`; mutate after mutations
- **SWR config** — `revalidateOnFocus: false`, `errorRetryCount: 2` in root layout
- **Components** — shadcn/ui primitives in `components/ui/`
- **File conventions** — tests co-located as `*.test.tsx` next to component
- **Tables** — `public.decks`, `public.cards` with RLS enforcing `user_id = auth.uid()`
- **Types** — `Deck` and `Card` interfaces in `lib/types.ts`

## Env vars needed

```
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
OPENROUTER_API_KEY=sk-or-...
OPENROUTER_MODEL=openai/gpt-4o-mini
OPENROUTER_BASE_URL=https://openrouter.ai/api/v1
```

## Implementation order (from spec)

1. Foundation: Next.js + Tailwind + shadcn/ui + Supabase client + middleware + RLS migrations
2. Auth: login/register pages + session handling
3. Decks: dashboard + CRUD API routes + components
4. Cards: deck detail + card CRUD + components
5. AI Generate: OpenRouter API route + AIGenerate component
6. Study: study view + FlipCard + progress
7. Polish: error boundaries, loading skeletons, responsive sidebar, empty states, tests

## Dev commands (inferred — to be confirmed)

- `npm run dev` — Next.js dev server
- `npm test` — Vitest
- `npx shadcn-ui@latest add <component>` — add shadcn/ui primitives
- `supabase start` — local Supabase (requires Supabase CLI)
- `supabase db push` — apply migrations

## AI generation endpoint

`POST /api/generate` — calls OpenRouter with structured prompt. Accepts `{ sourceText, count? }`. Returns `{ suggestions: [{ front, back }] }`. See spec for error handling rules (502 for LLM failures, 429 passthrough with Retry-After header).

## Testing priorities (from spec)

1. Validation schemas (unit tests for each Zod schema)
2. Auth forms (LoginForm, RegisterForm)
3. Deck CRUD (NewDeckModal, DeleteDeckDialog)
4. Card flows (ManualAdd, CardRow)
5. AI Generate (AISuggestionRow)
6. Study flip (FlipCard)
7. API routes (integration — stretch goal)
