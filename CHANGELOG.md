# Changelog

All notable changes to PlanExe CLI will be documented in this file.

## [0.0.4] - 2026-03-20

### Fixed
- Config directory: `~/.config/manicode/` → `~/.config/planexe/` (launcher + postinstall + preuninstall)
- PostHog env vars: `CODEBUFF_POSTHOG_*` → `PLANEXE_POSTHOG_*`
- Preuninstall script: now cleans up `planexe` binary, not `codebuff`
- Linux x64 binary included in release (was missing from v0.0.3)

### Changed
- Zero remaining `codebuff` or `manicode` references in launcher package

**Authors:** Bubba (claude-opus-4-6), Egon (claude-opus-4-6) — QA

## [0.0.3] - 2026-03-20

### Fixed
- "Starting Codebuff..." → "Starting PlanExe..." in download message
- "Failed to download codebuff" → "Failed to download planexe" in error message
- Metadata filename: `codebuff-metadata.json` → `planexe-metadata.json`
- Analytics event name: `cli.update_codebuff_failed` → `cli.update_planexe_failed`
- Linux x64 binary included in release (was missing in v0.0.2 initial upload)

### Added
- AGENTS.md with boss's coding standards
- CHANGELOG.md (this file)

**Authors:** Bubba (claude-opus-4-6), Egon (claude-opus-4-6) — QA

## [0.0.2] - 2026-03-20

### Added
- Auth method selector on startup: Claude Code, OpenAI Codex, OpenRouter BYOK, LM Studio local
- `cli/src/utils/planexe-auth.ts` — local auth config at `~/.config/planexe/auth.json`
- `cli/src/components/auth-method-selector.tsx` — React Ink component for auth selection
- Linux x64 binary in GitHub Releases (cross-compiled from darwin-arm64)

### Changed
- CodeBuff proprietary login bypassed — tool works without codebuff.com account
- `cli/src/index.tsx` — checks local PlanExe auth before showing codebuff.com login
- `cli/release/index.js` — download URL points to GitHub Releases (VoynichLabs/codebuff)
- `cli/release/package.json` — renamed to `planexe-cli`, version 0.0.2
- `cli/release/postinstall.js` — PlanExe welcome message

### Fixed
- N/A (first functional release)

**Authors:** Bubba (claude-opus-4-6), Egon (claude-opus-4-6)

## [0.0.1] - 2026-03-20

### Changed
- ASCII art branding: CODEBUFF → PLANEXE (full + small variants)
- Text fallback: "Codebuff CLI" → "PlanExe CLI"
- `CLAUDE_OAUTH_ENABLED` flipped from `false` to `true`

**Authors:** Bubba (claude-opus-4-6)
