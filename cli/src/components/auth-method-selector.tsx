/**
 * PlanExe Auth Method Selector — replaces codebuff.com login screen.
 *
 * Shows a simple menu:
 *   1. Claude Code (OAuth)
 *   2. OpenAI Codex (OAuth)
 *   3. OpenRouter API Key
 *   4. LM Studio (local)
 */

import React, { useCallback, useEffect, useState } from 'react'

import { useKeyboard } from '@opentui/react'
import { useRenderer } from '@opentui/react'
import { useLogo } from '../hooks/use-logo'
import { useSheenAnimation } from '../hooks/use-sheen-animation'
import { useTheme } from '../hooks/use-theme'
import { getLogoBlockColor, getLogoAccentColor } from '../utils/theme-system'
import {
  getPlanExeAuthConfig,
  savePlanExeAuthConfig,
  saveOpenRouterKey,
  getOpenRouterKey,
  getLmStudioBaseUrl,
  type PlanExeAuthMethod,
} from '../utils/planexe-auth'
import {
  openOAuthInBrowser as openClaudeOAuth,
  exchangeCodeForTokens as exchangeClaudeCode,
  getClaudeOAuthStatus,
} from '../utils/claude-oauth'
import {
  connectChatGptOAuth,
  exchangeChatGptCodeForTokens,
} from '../utils/chatgpt-oauth'

import type { KeyEvent } from '@opentui/core'

const AUTH_OPTIONS = [
  {
    key: 'claude' as PlanExeAuthMethod,
    label: 'Claude Code',
    desc: 'Connect your Claude Pro/Max subscription via OAuth',
  },
  {
    key: 'codex' as PlanExeAuthMethod,
    label: 'OpenAI Codex',
    desc: 'Connect your ChatGPT Plus/Pro subscription via OAuth',
  },
  {
    key: 'openrouter' as PlanExeAuthMethod,
    label: 'OpenRouter API Key',
    desc: 'Enter your OpenRouter key — access any model',
  },
  {
    key: 'lmstudio' as PlanExeAuthMethod,
    label: 'LM Studio (local)',
    desc: 'Connect to a local model at http://localhost:1234/v1',
  },
]

type SelectorState =
  | 'selecting'
  | 'claude-oauth'
  | 'codex-oauth'
  | 'openrouter-key'
  | 'lmstudio-confirm'
  | 'done'

interface AuthMethodSelectorProps {
  onAuthConfigured: () => void
}

export const AuthMethodSelector: React.FC<AuthMethodSelectorProps> = ({
  onAuthConfigured,
}) => {
  const renderer = useRenderer()
  const theme = useTheme()
  const [selectedIndex, setSelectedIndex] = useState(0)
  const [state, setState] = useState<SelectorState>('selecting')
  const [keyInput, setKeyInput] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [statusMsg, setStatusMsg] = useState<string | null>(null)
  const [sheenPosition, setSheenPosition] = useState(0)

  const terminalWidth = renderer?.width ?? 80
  const terminalHeight = renderer?.height ?? 24
  const contentMaxWidth = Math.min(terminalWidth - 4, 76)

  const blockColor = getLogoBlockColor(theme.name)
  const accentColor = getLogoAccentColor(theme.name)
  const { applySheenToChar } = useSheenAnimation({
    logoColor: theme.foreground,
    accentColor,
    blockColor,
    terminalWidth,
    sheenPosition,
    setSheenPosition,
  })
  const { component: logoComponent } = useLogo({
    availableWidth: contentMaxWidth,
    applySheenToChar,
    accentColor,
    blockColor,
  })

  // Auto-start LM Studio confirmation when that flow selected
  useEffect(() => {
    if (state === 'lmstudio-confirm') {
      savePlanExeAuthConfig({
        method: 'lmstudio',
        lmstudioBaseUrl: getLmStudioBaseUrl(),
        configuredAt: new Date().toISOString(),
      })
      setStatusMsg(`✓ LM Studio configured at ${getLmStudioBaseUrl()}`)
      setTimeout(() => {
        onAuthConfigured()
      }, 1500)
    }
  }, [state, onAuthConfigured])

  // Auto-open browser for Claude OAuth when that flow selected
  useEffect(() => {
    if (state === 'claude-oauth') {
      setStatusMsg('Opening browser for Claude OAuth…')
      openClaudeOAuth().catch((err) => {
        setError(err instanceof Error ? err.message : 'Failed to open browser')
        setState('selecting')
      })
    }
  }, [state])

  // Auto-open browser for Codex OAuth when that flow selected
  useEffect(() => {
    if (state === 'codex-oauth') {
      setStatusMsg('Opening browser for OpenAI Codex OAuth…')
      try {
        connectChatGptOAuth()
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to open browser')
        setState('selecting')
      }
    }
  }, [state])

  const handleSelect = useCallback(() => {
    const chosen = AUTH_OPTIONS[selectedIndex]
    setError(null)
    setStatusMsg(null)
    switch (chosen.key) {
      case 'claude':
        setState('claude-oauth')
        break
      case 'codex':
        setState('codex-oauth')
        break
      case 'openrouter':
        setState('openrouter-key')
        setKeyInput('')
        break
      case 'lmstudio':
        setState('lmstudio-confirm')
        break
    }
  }, [selectedIndex])

  const handleCodeSubmit = useCallback(
    async (code: string) => {
      if (!code.trim()) return
      try {
        if (state === 'claude-oauth') {
          setStatusMsg('Exchanging code…')
          await exchangeClaudeCode(code.trim())
          savePlanExeAuthConfig({
            method: 'claude',
            configuredAt: new Date().toISOString(),
          })
          setStatusMsg('✓ Claude connected!')
          setTimeout(() => onAuthConfigured(), 1000)
        } else if (state === 'codex-oauth') {
          setStatusMsg('Completing Codex OAuth…')
          await exchangeChatGptCodeForTokens(code.trim())
          savePlanExeAuthConfig({
            method: 'codex',
            configuredAt: new Date().toISOString(),
          })
          setStatusMsg('✓ Codex connected!')
          setTimeout(() => onAuthConfigured(), 1000)
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Auth failed')
        setStatusMsg(null)
      }
    },
    [state, onAuthConfigured],
  )

  const handleOpenRouterKeySubmit = useCallback(
    (key: string) => {
      if (!key.trim()) return
      saveOpenRouterKey(key.trim())
      savePlanExeAuthConfig({
        method: 'openrouter',
        configuredAt: new Date().toISOString(),
      })
      setStatusMsg('✓ OpenRouter key saved!')
      setTimeout(() => onAuthConfigured(), 1000)
    },
    [onAuthConfigured],
  )

  useKeyboard(
    useCallback(
      (key: KeyEvent) => {
        const isCtrlC = key.ctrl && key.name === 'c'
        if (isCtrlC) process.exit(0)

        if (state === 'selecting') {
          if (key.name === 'up' || key.name === 'k') {
            if ('preventDefault' in key && typeof key.preventDefault === 'function') key.preventDefault()
            setSelectedIndex((i) => (i - 1 + AUTH_OPTIONS.length) % AUTH_OPTIONS.length)
            return
          }
          if (key.name === 'down' || key.name === 'j') {
            if ('preventDefault' in key && typeof key.preventDefault === 'function') key.preventDefault()
            setSelectedIndex((i) => (i + 1) % AUTH_OPTIONS.length)
            return
          }
          // Number shortcuts 1-4
          if (['1', '2', '3', '4'].includes(key.name ?? '')) {
            const idx = parseInt(key.name ?? '1', 10) - 1
            setSelectedIndex(idx)
            // slight delay so user sees the highlight
            setTimeout(handleSelect, 100)
            return
          }
          if (key.name === 'return' || key.name === 'enter') {
            if ('preventDefault' in key && typeof key.preventDefault === 'function') key.preventDefault()
            handleSelect()
            return
          }
        }

        if (state === 'claude-oauth' || state === 'codex-oauth') {
          // User pastes the code — capture character input
          if (key.name === 'return' || key.name === 'enter') {
            if ('preventDefault' in key && typeof key.preventDefault === 'function') key.preventDefault()
            void handleCodeSubmit(keyInput)
            setKeyInput('')
            return
          }
          if (key.name === 'backspace') {
            if ('preventDefault' in key && typeof key.preventDefault === 'function') key.preventDefault()
            setKeyInput((prev) => prev.slice(0, -1))
            return
          }
          if (key.sequence && !key.ctrl && !key.meta && key.sequence.length === 1) {
            if ('preventDefault' in key && typeof key.preventDefault === 'function') key.preventDefault()
            setKeyInput((prev) => prev + key.sequence)
            return
          }
        }

        if (state === 'openrouter-key') {
          if (key.name === 'return' || key.name === 'enter') {
            if ('preventDefault' in key && typeof key.preventDefault === 'function') key.preventDefault()
            handleOpenRouterKeySubmit(keyInput)
            setKeyInput('')
            return
          }
          if (key.name === 'backspace') {
            if ('preventDefault' in key && typeof key.preventDefault === 'function') key.preventDefault()
            setKeyInput((prev) => prev.slice(0, -1))
            return
          }
          if (key.sequence && !key.ctrl && !key.meta && key.sequence.length === 1) {
            if ('preventDefault' in key && typeof key.preventDefault === 'function') key.preventDefault()
            setKeyInput((prev) => prev + key.sequence)
            return
          }
        }
      },
      [state, handleSelect, handleCodeSubmit, handleOpenRouterKeySubmit, keyInput],
    ),
  )

  const renderMenu = () => (
    <box
      style={{
        flexDirection: 'column',
        alignItems: 'flex-start',
        gap: 0,
        marginTop: 1,
      }}
    >
      <text>
        <span fg={theme.secondary}>How do you want to connect?</span>
      </text>
      <text> </text>
      {AUTH_OPTIONS.map((opt, i) => (
        <box key={opt.key ?? i} style={{ flexDirection: 'column', marginBottom: 1 }}>
          <text>
            <span fg={i === selectedIndex ? theme.primary : theme.foreground}>
              {i === selectedIndex ? '▶ ' : '  '}
              {i + 1}. {opt.label}
            </span>
          </text>
          <text>
            <span fg={theme.secondary}>     {opt.desc}</span>
          </text>
        </box>
      ))}
      <text> </text>
      <text>
        <span fg={theme.secondary}>↑/↓ or 1-4 to select, Enter to confirm</span>
      </text>
    </box>
  )

  const renderCodeInput = (prompt: string) => (
    <box style={{ flexDirection: 'column', marginTop: 1, gap: 0 }}>
      <text>
        <span fg={theme.info}>{prompt}</span>
      </text>
      <text> </text>
      {statusMsg && (
        <text>
          <span fg={theme.success}>{statusMsg}</span>
        </text>
      )}
      {error && (
        <text>
          <span fg="red">Error: {error}</span>
        </text>
      )}
      <text>
        <span fg={theme.foreground}>
          Code: {keyInput.length > 0 ? '*'.repeat(keyInput.length) : '_'}
        </span>
      </text>
      <text> </text>
      <text>
        <span fg={theme.secondary}>Paste the code from your browser, then press Enter</span>
      </text>
    </box>
  )

  const renderKeyInput = () => (
    <box style={{ flexDirection: 'column', marginTop: 1, gap: 0 }}>
      <text>
        <span fg={theme.info}>Enter your OpenRouter API key</span>
      </text>
      <text>
        <span fg={theme.secondary}>
          Get a key at https://openrouter.ai/keys — stored in ~/.config/planexe/openrouter-key
        </span>
      </text>
      <text> </text>
      {statusMsg && (
        <text>
          <span fg={theme.success}>{statusMsg}</span>
        </text>
      )}
      {error && (
        <text>
          <span fg="red">Error: {error}</span>
        </text>
      )}
      <text>
        <span fg={theme.foreground}>
          Key: {keyInput.length > 0 ? keyInput.slice(0, 8) + '…' + '*'.repeat(Math.max(0, keyInput.length - 8)) : '_'}
        </span>
      </text>
      <text> </text>
      <text>
        <span fg={theme.secondary}>Type or paste your key, then press Enter</span>
      </text>
    </box>
  )

  return (
    <box
      style={{
        width: '100%',
        height: '100%',
        backgroundColor: theme.surface,
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        padding: 2,
      }}
    >
      <box
        style={{
          flexDirection: 'column',
          alignItems: 'flex-start',
          maxWidth: contentMaxWidth,
          width: '100%',
        }}
      >
        {logoComponent}
        {state === 'selecting' && renderMenu()}
        {state === 'claude-oauth' &&
          renderCodeInput('Browser opened — sign in with Claude, then paste the authorization code below.')}
        {state === 'codex-oauth' &&
          renderCodeInput('Browser opened — sign in with OpenAI, then paste the authorization code below.')}
        {state === 'openrouter-key' && renderKeyInput()}
        {state === 'lmstudio-confirm' && (
          <box style={{ flexDirection: 'column', marginTop: 1 }}>
            {statusMsg && (
              <text>
                <span fg={theme.success}>{statusMsg}</span>
              </text>
            )}
          </box>
        )}
      </box>
    </box>
  )
}
