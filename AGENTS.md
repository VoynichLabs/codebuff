# AGENTS.md — PlanExe CLI (VoynichLabs/codebuff fork)

## Purpose
PlanExe CLI is a CodeBuff fork wrapped with PlanExe-specific agents, coding standards, and auth flow. It's an AI coding agent that Simon, Mark, and the lobster crew use daily for PlanExe development and general coding.

## Coding Standards

### File Headers
Every new TS/JS file must start with:
```typescript
/**
 * @author [Author Name]
 * @date [YYYY-MM-DD]
 * @purpose [Verbose description of what this file does]
 * @srp Single responsibility: [what this file is responsible for]
 * @dry Checked against: [list files checked for duplication]
 */
```

### SRP/DRY
- Single Responsibility Principle — one file, one job
- Don't Repeat Yourself — search before creating, reuse existing patterns
- Check `agents/`, `cli/src/`, `common/src/` for existing patterns before adding new ones

### No Mocks/Placeholders
- Ship real implementations only
- No stubs, no fake data, no "coming soon" buttons
- If a feature isn't ready, don't show it

### CHANGELOG.md
- SemVer at top
- What/why/how for every change
- Include author model name

### Comment the Non-Obvious
- Inline comments where logic could confuse
- Especially in agent prompts and auth flows

### No AI Slop
- No default Inter typography, random purple gradients, uniform pill buttons
- Match existing CodeBuff design language

### Quality Over Speed
- Slow down, think, secure plan approval before editing
- No time estimates or premature celebration

## Git Workflow
- Branch convention: `bubba/*` for Bubba's work, `egon/*` for Egon's
- PRs to main require cross-review
- No direct commits to main without review

## Auth Architecture
- Claude Code OAuth (PKCE flow with Anthropic)
- OpenAI Codex OAuth (PKCE flow with OpenAI)
- OpenRouter BYOK (API key stored locally)
- LM Studio (localhost, no auth)
- CodeBuff proprietary login: BYPASSED (dead code, cleanup in progress)

## Key Directories
- `agents/` — Agent definitions (TypeScript objects with schemas)
- `cli/src/` — CLI entry point, React Ink TUI, auth flow
- `common/src/` — Shared types, tools, schemas
- `packages/agent-runtime/` — Step loop, tool dispatch, sub-agent spawning
- `cli/release/` — npm launcher package (thin wrapper that downloads binary)
