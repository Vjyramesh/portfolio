import { beforeEach, describe, expect, it } from 'vitest'
import { applyTheme, DEFAULT_THEME, getStoredTheme, setTheme, THEME_STORAGE_KEY } from './theme'

describe('theme (CSS-variable driven)', () => {
  beforeEach(() => {
    localStorage.clear()
    document.documentElement.removeAttribute('data-theme')
  })

  it('defaults to system when nothing is stored', () => {
    expect(getStoredTheme()).toBe('system')
    expect(DEFAULT_THEME).toBe('system')
  })

  it('reads a valid stored choice', () => {
    localStorage.setItem(THEME_STORAGE_KEY, 'dark')
    expect(getStoredTheme()).toBe('dark')
  })

  it('falls back to system for a corrupt stored value', () => {
    localStorage.setItem(THEME_STORAGE_KEY, 'neon')
    expect(getStoredTheme()).toBe('system')
  })

  it('applyTheme sets the data-theme attribute on <html>', () => {
    applyTheme('dark')
    expect(document.documentElement.getAttribute('data-theme')).toBe('dark')

    applyTheme('light')
    expect(document.documentElement.getAttribute('data-theme')).toBe('light')
  })

  it('setTheme persists the choice and reflects it on <html>', () => {
    setTheme('light')

    expect(localStorage.getItem(THEME_STORAGE_KEY)).toBe('light')
    expect(document.documentElement.getAttribute('data-theme')).toBe('light')
  })
})
