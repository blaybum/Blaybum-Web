export const colors = {
  white: '#FFFFFF',
  black: '#000000',

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
  none: '0px',
  xs: '4px',
  sm: '8px',
  md: '12px',
  lg: '16px',
  xl: '24px',
  xxl: '32px',
  xxxl: '48px',
} as const

export const theme = {
  colors,
  spacing,
} as const

export type Theme = typeof theme;