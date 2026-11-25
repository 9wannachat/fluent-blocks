import { useEffect } from 'react'
import { useLiveQuery } from 'dexie-react-hooks'
import { Monitor, Moon, Sun } from 'lucide-react'
import * as RadioGroupPrimitive from '@radix-ui/react-radio-group'
import { db, defaultSettings, saveSettings, type Settings } from '../storage'

export type ThemePreference = Settings['theme']

/** Mirrors the stored preference so index.html can paint the right theme before React loads. */
export const themeStorageKey = 'fluent-blocks-theme'
const darkQuery = '(prefers-color-scheme: dark)'
const themeColors = { dark: '#0B0D10', light: '#F6F7F9' }

export const themeOptions: { value: ThemePreference; label: string; Icon: typeof Sun }[] = [
  { value: 'light', label: 'สว่าง', Icon: Sun },
  { value: 'system', label: 'ตามระบบ', Icon: Monitor },
  { value: 'dark', label: 'มืด', Icon: Moon },
]

function resolve(preference: ThemePreference) {
  if (preference !== 'system') return preference
  return window.matchMedia?.(darkQuery).matches ? 'dark' : 'light'
}

export function applyTheme(preference: ThemePreference) {
  const resolved = resolve(preference)
  const root = document.documentElement
  root.dataset.theme = resolved
  root.classList.toggle('dark', resolved === 'dark')
  document.querySelector('meta[name="theme-color"]')?.setAttribute('content', themeColors[resolved])
  try { localStorage.setItem(themeStorageKey, preference) } catch { /* storage may be unavailable */ }
}

function storedPreference(): ThemePreference {
  try {
    const value = localStorage.getItem(themeStorageKey)
    if (value === 'light' || value === 'dark' || value === 'system') return value
  } catch { /* storage may be unavailable */ }
  return defaultSettings.theme
}

/** Saved preference, or undefined while IndexedDB is still loading. */
function useSavedPreference(): ThemePreference | undefined {
  const settings = useLiveQuery(async () => (await db.settings.get('preferences')) ?? null, [])
  // With no saved record yet, trust the mirrored value: the IndexedDB write may still be in flight.
  return settings === undefined ? undefined : settings?.theme ?? storedPreference()
}

export function useThemePreference(): ThemePreference {
  return useSavedPreference() ?? storedPreference()
}

/** Keeps the document theme in sync with the saved preference and, for "system", the OS setting. */
export function useThemeSync() {
  const preference = useSavedPreference()
  // Listen for OS changes from the start, so a change made while the saved preference is still being written is not missed.
  useEffect(() => {
    if (!window.matchMedia) return
    const media = window.matchMedia(darkQuery)
    const sync = () => { if (storedPreference() === 'system') applyTheme('system') }
    media.addEventListener('change', sync)
    return () => media.removeEventListener('change', sync)
  }, [])
  useEffect(() => {
    // Wait for IndexedDB so the theme painted by index.html is not flipped to the default first.
    if (!preference) return
    applyTheme(preference)
  }, [preference])
}

export function ThemeSwitcher({ compact = false, className = '' }: { compact?: boolean; className?: string }) {
  const preference = useThemePreference()
  async function choose(value: string) {
    const next = value as ThemePreference
    applyTheme(next)
    await saveSettings({ theme: next }).catch(() => applyTheme(preference))
  }
  return (
    <RadioGroupPrimitive.Root className={`theme-switcher ${compact ? 'compact' : ''} ${className}`} aria-label="ธีม"
      value={preference} onValueChange={(value) => void choose(value)} orientation="horizontal">
      {themeOptions.map(({ value, label, Icon }) => (
        <RadioGroupPrimitive.Item key={value} value={value} className="theme-option" aria-label={label} title={label}>
          <Icon size={16} aria-hidden="true" />{!compact && <span>{label}</span>}
        </RadioGroupPrimitive.Item>
      ))}
    </RadioGroupPrimitive.Root>
  )
}
