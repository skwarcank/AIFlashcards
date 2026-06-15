# Decisions

This file records durable project decisions, clarifications, and intentional deviations that future agents or contributors need to understand.

Use this when a choice would confuse someone who only reads the original plan, a historical spec, or the current code. Do not use it as a changelog or task list.

## 2026-06-15 - Use A Lightweight Agent-Focused Docs Set

Status: accepted

Context:
Documentation primarily serves OpenCode and other AI agents. The project needs fast repo-state onboarding and rule adherence without creating many stale, duplicated docs.

Decision:
Maintain a small documentation set: `AGENTS.md` for agent operating rules, `docs/REPO_STATE.md` for volatile implementation status, `docs/DECISIONS.md` for durable decisions, `docs/CHANGELOG.md` for completed work, `README.md` for human onboarding, and `.env.example` for configuration.

Impact:
Avoid adding separate API docs, component docs, Storybook docs, public user docs, or versioned docs until implementation stabilizes and those docs can be generated or kept narrow.

## 2026-06-15 - Treat Missing Spec Files As A Repo-State Risk

Status: accepted

Context:
Older agent guidance referenced `PRD_UI_SPEC.md` and `IMPLEMENTATION_SPEC.md` as source-of-truth documents, but those files are not present in the workspace during this documentation update.

Decision:
Document the absence in `README.md`, `AGENTS.md`, and `docs/REPO_STATE.md`. Until the files are restored, agents should use implemented code, current docs, and committed migrations as the available source context.

Impact:
Agents should not assume the missing spec files exist. If they are restored later, update the source-of-truth hierarchy and link them from `README.md` and `AGENTS.md`.

## Decision Entry Template

```md
## YYYY-MM-DD - Decision Title

Status: proposed | accepted | superseded

Context:
Why this decision was needed.

Decision:
What was decided.

Impact:
What future agents and contributors should do differently because of this decision.
```
