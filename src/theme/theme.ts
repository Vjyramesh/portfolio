// Theming is driven entirely by CSS variables (see src/index.css). The only job
// left for JS is recording the user's *choice* and reflecting it as the
// `data-theme` attribute on <html>; the CSS (incl. the prefers-color-scheme
// media query for "system") does all the actual resolution.

export type Theme = 'light' | 'dark' | 'system'

export const THEME_STORAGE_KEY = 'theme'
export const DEFAULT_THEME: Theme = 'system'

function isTheme(value: unknown): value is Theme {
  return value === 'light' || value === 'dark' || value === 'system'
}

export function getStoredTheme(): Theme {
  return isTheme(localStorage.getItem(THEME_STORAGE_KEY))
    ? (localStorage.getItem(THEME_STORAGE_KEY) as Theme)
    : DEFAULT_THEME
}

export function applyTheme(theme: Theme): void {
  document.documentElement.dataset.theme = theme
}

export function setTheme(theme: Theme): void {
  localStorage.setItem(THEME_STORAGE_KEY, theme)
  applyTheme(theme)
}
