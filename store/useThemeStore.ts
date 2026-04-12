import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { themes, defaultTheme, type Theme } from '@/theme/themes'

type ThemeStore = {
  themeId: string
  theme: Theme
  setTheme: (id: string) => void
}

export const useThemeStore = create<ThemeStore>()(
  persist(
    (set) => ({
      themeId: defaultTheme.id,
      theme: defaultTheme,
      setTheme: (id: string) => {
        const next = themes[id] ?? defaultTheme
        set({ themeId: next.id, theme: next })
      },
    }),
    {
      name: 'video-vault-theme',
    }
  )
)
