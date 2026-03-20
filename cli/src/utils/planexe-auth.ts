/**
 * PlanExe Auth — manages local auth config for PlanExe CLI v0.0.2
 * Replaces codebuff.com account login with direct provider selection.
 *
 * Auth methods:
 *   - claude     → Claude OAuth (existing flow)
 *   - codex      → ChatGPT/Codex OAuth (existing flow)
 *   - openrouter → API key stored in ~/.config/planexe/openrouter-key
 *   - lmstudio   → Local LM Studio at http://localhost:1234/v1 (no auth)
 */

import fs from 'fs'
import os from 'os'
import path from 'path'

export type PlanExeAuthMethod =
  | 'claude'
  | 'codex'
  | 'openrouter'
  | 'lmstudio'
  | null

export interface PlanExeAuthConfig {
  method: PlanExeAuthMethod
  openrouterKey?: string
  lmstudioBaseUrl?: string
  configuredAt?: string
}

const PLANEXE_CONFIG_DIR = path.join(os.homedir(), '.config', 'planexe')
const AUTH_CONFIG_PATH = path.join(PLANEXE_CONFIG_DIR, 'auth.json')
const OPENROUTER_KEY_PATH = path.join(PLANEXE_CONFIG_DIR, 'openrouter-key')

function ensureConfigDir(): void {
  if (!fs.existsSync(PLANEXE_CONFIG_DIR)) {
    fs.mkdirSync(PLANEXE_CONFIG_DIR, { recursive: true })
  }
}

export function getPlanExeAuthConfig(): PlanExeAuthConfig | null {
  try {
    if (!fs.existsSync(AUTH_CONFIG_PATH)) return null
    const raw = fs.readFileSync(AUTH_CONFIG_PATH, 'utf8')
    return JSON.parse(raw) as PlanExeAuthConfig
  } catch {
    return null
  }
}

export function savePlanExeAuthConfig(config: PlanExeAuthConfig): void {
  ensureConfigDir()
  fs.writeFileSync(AUTH_CONFIG_PATH, JSON.stringify(config, null, 2))
}

export function clearPlanExeAuthConfig(): void {
  try {
    if (fs.existsSync(AUTH_CONFIG_PATH)) fs.unlinkSync(AUTH_CONFIG_PATH)
    if (fs.existsSync(OPENROUTER_KEY_PATH)) fs.unlinkSync(OPENROUTER_KEY_PATH)
  } catch {
    // ignore
  }
}

export function getOpenRouterKey(): string | null {
  // Check env var first
  if (process.env.OPENROUTER_API_KEY) return process.env.OPENROUTER_API_KEY

  try {
    if (!fs.existsSync(OPENROUTER_KEY_PATH)) return null
    return fs.readFileSync(OPENROUTER_KEY_PATH, 'utf8').trim() || null
  } catch {
    return null
  }
}

export function saveOpenRouterKey(key: string): void {
  ensureConfigDir()
  fs.writeFileSync(OPENROUTER_KEY_PATH, key.trim())
}

export function getLmStudioBaseUrl(): string {
  return 'http://localhost:1234/v1'
}

/**
 * Returns true if the user has a configured PlanExe auth method saved.
 */
export function hasPlanExeAuth(): boolean {
  const config = getPlanExeAuthConfig()
  if (!config || !config.method) return false

  switch (config.method) {
    case 'openrouter':
      return !!getOpenRouterKey()
    case 'lmstudio':
      return true // no key needed
    case 'claude':
    case 'codex':
      return true // handled by their own OAuth credential stores
    default:
      return false
  }
}
