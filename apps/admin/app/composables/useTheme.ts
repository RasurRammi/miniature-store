export type Theme = 'default' | 'nomnom' | 'neko'
export type ThemeData = { logoSrc: string, logoTitle: string }
const themeMap = new Map<Theme, ThemeData>([
  ['default', { logoSrc: '/favicon.ico', logoTitle: 'Miniature Store Base' }],
  ['nomnom', { logoSrc: '/nomnom-logo.png', logoTitle: 'NomNom Miniatures' }],
  ['neko', { logoSrc: '/neko-logo.png', logoTitle: 'Neko Figurines' }],
])

const STORAGE_KEY = 'app-theme'

export function useTheme() {
  const theme = useState<Theme>('theme', () => 'default')
  const themeData = useState<ThemeData>('themeData', () => themeMap.get('default')!)

  function applyTheme(t: Theme) {
    if (t === 'default') {
      delete document.documentElement.dataset.theme
    }
    else {
      document.documentElement.dataset.theme = t
    }
    themeData.value = themeMap.get(t)!
  }

  const setTheme = (t: Theme) => {
    theme.value = t
    if (import.meta.client) {
      localStorage.setItem(STORAGE_KEY, t)
      applyTheme(t)
    }
  }

  // Rehydrate on mount — reads from localStorage to avoid flash on reload
  onMounted(() => {
    const saved = localStorage.getItem(STORAGE_KEY) as Theme | null
    if (saved && saved !== theme.value) {
      theme.value = saved
    }
    applyTheme(theme.value)
  })

  return { theme: readonly(theme), themeData: readonly(themeData), setTheme }
}
