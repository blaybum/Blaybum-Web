export const colors = {
  primary: {
    100: '#E9F5EA',
    500: '#4CAF50',
  },
  natural: {
    100: '#F5F5F5',
    700: '#757575',
  },
  bg: {
    primary: '#FFFFFF',
    secondary: '#F5F5F5',
  },
} as const

export const spacing = {
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 24,
  xxl: 32,
  xxxl: 48,
} as const

export const theme = {
  colors,
  spacing,
} as const

export type Theme = typeof theme;