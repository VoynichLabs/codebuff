# Changelog

All notable changes to PlanExe CLI will be documented in this file.

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
