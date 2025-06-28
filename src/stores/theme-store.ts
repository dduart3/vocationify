import { create } from 'zustand'
import { persist, devtools } from 'zustand/middleware'

type Theme = 'light' | 'dark' | 'system'

interface ThemeStore {
  theme: Theme
  actualTheme: 'light' | 'dark'
  setTheme: (theme: Theme) => void
  toggleTheme: () => void
  initializeTheme: () => void
}

const getSystemTheme = (): 'light' | 'dark' => {
  if (typeof window === 'undefined') return 'light'
  return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'
}

const getActualTheme = (theme: Theme): 'light' | 'dark' => {
  return theme === 'system' ? getSystemTheme() : theme
}

const applyTheme = (theme: 'light' | 'dark') => {
  if (typeof window === 'undefined') return
  
  const root = window.document.documentElement
  root.classList.remove('light', 'dark')
  root.classList.add(theme)
  
  // Update meta theme-color for mobile browsers
  const metaThemeColor = document.querySelector('meta[name="theme-color"]')
  if (metaThemeColor) {
    metaThemeColor.setAttribute(
      'content', 
      theme === 'dark' ? '#0f172a' : '#ffffff'
    )
  }
}

export const useThemeStore = create<ThemeStore>()(
  devtools(
    persist(
      (set, get) => ({
        theme: 'system',
        actualTheme: getSystemTheme(),
        
        setTheme: (theme: Theme) => {
          const actualTheme = getActualTheme(theme)
          applyTheme(actualTheme)
          set({ theme, actualTheme })
        },
        
        toggleTheme: () => {
          const { theme } = get()
          let newTheme: Theme
          
          switch (theme) {
            case 'light':
              newTheme = 'dark'
              break
            case 'dark':
              newTheme = 'system'
              break
            case 'system':
              newTheme = 'light'
              break
            default:
              newTheme = 'light'
          }
          
          get().setTheme(newTheme)
        },

        initializeTheme: () => {
          const { theme } = get()
          const actualTheme = getActualTheme(theme)
          applyTheme(actualTheme)
          set({ actualTheme })
        },
      }),
      {
        name: 'career-compass-theme',
        onRehydrateStorage: () => (state) => {
          if (state) {
            // Apply theme immediately on hydration
            const actualTheme = getActualTheme(state.theme)
            applyTheme(actualTheme)
            state.actualTheme = actualTheme
          }
        },
      }
    ),
    { name: 'theme-store' }
  )
)

// Listen for system theme changes
if (typeof window !== 'undefined') {
  const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)')
  
  mediaQuery.addEventListener('change', () => {
    const store = useThemeStore.getState()
    if (store.theme === 'system') {
      const actualTheme = getSystemTheme()
      applyTheme(actualTheme)
      useThemeStore.setState({ actualTheme })
    }
  })
}

// Helper functions
export const getTheme = () => useThemeStore.getState().theme
export const getActualThemeValue = () => useThemeStore.getState().actualTheme
export const toggleTheme = () => useThemeStore.getState().toggleTheme()
