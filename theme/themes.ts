export type Theme = {
  id: string
  name: string
  vars: {
    background: string
    surface: string
    primary: string
    secondary: string
    text: string
    textMuted: string
    border: string
    error: string
    success: string
  }
}

export const themes: Record<string, Theme> = {
  terminalGreen: {
    id: 'terminalGreen',
    name: 'Terminal Green',
    vars: {
      background: '#0a0a0a',
      surface: '#111111',
      primary: '#00ff41',
      secondary: '#00cc33',
      text: '#00ff41',
      textMuted: '#007a1f',
      border: '#00ff4133',
      error: '#ff4444',
      success: '#00ff41',
    },
  },
  terminalAmber: {
    id: 'terminalAmber',
    name: 'Terminal Amber',
    vars: {
      background: '#0a0800',
      surface: '#111100',
      primary: '#ffb000',
      secondary: '#cc8800',
      text: '#ffb000',
      textMuted: '#7a5500',
      border: '#ffb00033',
      error: '#ff4444',
      success: '#ffb000',
    },
  },
  terminalWhite: {
    id: 'terminalWhite',
    name: 'Terminal White',
    vars: {
      background: '#0a0a0a',
      surface: '#141414',
      primary: '#e0e0e0',
      secondary: '#aaaaaa',
      text: '#e0e0e0',
      textMuted: '#555555',
      border: '#e0e0e033',
      error: '#ff4444',
      success: '#e0e0e0',
    },
  },
  retroVHS: {
    id: 'retroVHS',
    name: 'Retro VHS',
    vars: {
      background: '#0d0d1a',
      surface: '#13132a',
      primary: '#7ec8c8',
      secondary: '#c878c8',
      text: '#d0d0e8',
      textMuted: '#5a5a7a',
      border: '#7ec8c833',
      error: '#ff6b6b',
      success: '#7ec8c8',
    },
  },
  cyber: {
    id: 'cyber',
    name: 'Cyber',
    vars: {
      background: '#060010',
      surface: '#0d001a',
      primary: '#ff00ff',
      secondary: '#00ffff',
      text: '#ff00ff',
      textMuted: '#660066',
      border: '#ff00ff33',
      error: '#ff4444',
      success: '#00ffff',
    },
  },
  modern: {
    id: 'modern',
    name: 'Modern',
    vars: {
      background: '#0f1117',
      surface: '#1a1d27',
      primary: '#6c8ebf',
      secondary: '#8a6cbf',
      text: '#e8eaf0',
      textMuted: '#6b7280',
      border: '#2a2d3a',
      error: '#ef4444',
      success: '#22c55e',
    },
  },
}

export const defaultTheme = themes.terminalGreen
