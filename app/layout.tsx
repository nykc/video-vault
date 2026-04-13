'use client'

import { useEffect } from 'react'
import { useThemeStore } from '@/store/useThemeStore'
import Providers from './providers'
import './globals.css'

function ThemeProvider({ children }: { children: React.ReactNode }) {
  const { theme } = useThemeStore()

  useEffect(() => {
    const root = document.documentElement
    Object.entries(theme.vars).forEach(([key, value]) => {
      root.style.setProperty(`--${key}`, value)
    })
  }, [theme])

  return <>{children}</>
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body>
        <Providers>
          <ThemeProvider>
            <div className="min-h-screen flex flex-col">
              <header className="border-b px-6 py-3 flex items-center justify-between" style={{ borderColor: 'var(--border)', backgroundColor: 'var(--surface)' }}>
                <a href="/" className="text-lg tracking-widest" style={{ color: 'var(--primary)' }}>
                  VIDEO VAULT
                </a>
                <nav className="flex gap-6 text-xs tracking-widest" style={{ color: 'var(--textMuted)' }}>
                  <a href="/collection" style={{ color: 'var(--textMuted)' }}>[ COLLECTION ]</a>
                  <a href="/search" style={{ color: 'var(--textMuted)' }}>[ SEARCH ]</a>
                  <a href="/want-list" style={{ color: 'var(--textMuted)' }}>[ WANT LIST ]</a>
                </nav>
              </header>
              <main className="flex-1 p-6">
                {children}
              </main>
            </div>
          </ThemeProvider>
        </Providers>
      </body>
    </html>
  )
}
