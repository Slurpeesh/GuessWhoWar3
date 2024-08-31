import type { Config } from 'tailwindcss'

export default {
  content: ['./src/**/*.{ts,tsx,html}'],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        background: 'hsl(var(--color-background) / <alpha-value>)',
        foreground: 'hsl(var(--color-foreground) / <alpha-value>)',
        'foreground-within-accent':
          'hsl(var(--color-foreground-within-accent) / <alpha-value>)',
        accent: 'hsl(var(--color-accent) / <alpha-value>)',
        'accent-hover': 'hsl(var(--color-accent-hover) / <alpha-value>)',
        muted: 'hsl(var(--color-muted) / <alpha-value>)',
        alert: 'hsl(var(--color-alert) / <alpha-value>)',
        danger: 'hsl(var(--color-danger) / <alpha-value>)',
        'danger-hover': 'hsl(var(--color-danger-hover) / <alpha-value>)',
        success: 'hsl(var(--color-success) / <alpha-value>)',
        'success-hover': 'hsl(var(--color-success-hover) / <alpha-value>)',
      },
    },
  },
  plugins: [],
} satisfies Config
