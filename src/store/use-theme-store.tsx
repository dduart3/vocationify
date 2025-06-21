import { create } from 'zustand'
import { persist } from 'zustand/middleware'

type Theme = 'dark' | 'light' | 'system'

interface ThemeStore {
  theme: Theme
  setTheme: (theme: Theme) => void
  resolvedTheme: 'dark' | 'light'
  toggleTheme: () => void
}

export const useThemeStore = create<ThemeStore>()(
  persist(
    (set, get) => ({
      theme: 'dark',
      resolvedTheme: 'dark',
      
      setTheme: (theme: Theme) => {
        const resolvedTheme = theme === 'system' 
          ? window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'
          : theme
        
        set({ theme, resolvedTheme })
        
        // Apply theme to document
        document.documentElement.classList.remove('light', 'dark')
        document.documentElement.classList.add(resolvedTheme)
      },
      
      toggleTheme: () => {
        const { theme } = get()
        const newTheme = theme === 'dark' ? 'light' : 'dark'
        get().setTheme(newTheme)
      }
    }),
    {
      name: 'vocationify-theme-storage',
      onRehydrateStorage: () => (state) => {
        if (state) {
          // Apply theme on hydration
          document.documentElement.classList.remove('light', 'dark')
          document.documentElement.classList.add(state.resolvedTheme)
        }
      }
    }
  )
)
