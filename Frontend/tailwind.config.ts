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
        'alert-hover': 'hsl(var(--color-alert-hover) / <alpha-value>)',
        danger: 'hsl(var(--color-danger) / <alpha-value>)',
        'danger-hover': 'hsl(var(--color-danger-hover) / <alpha-value>)',
        success: 'hsl(var(--color-success) / <alpha-value>)',
        'success-hover': 'hsl(var(--color-success-hover) / <alpha-value>)',
      },
      keyframes: {
        'accordion-down': {
          from: { height: '0' },
          to: { height: 'var(--radix-accordion-content-height)' },
        },
        'accordion-up': {
          from: { height: 'var(--radix-accordion-content-height)' },
          to: { height: '0' },
        },
      },
      animation: {
        'accordion-down': 'accordion-down 0.2s ease-out',
        'accordion-up': 'accordion-up 0.2s ease-out',
      },
    },
  },
  plugins: [],
} satisfies Config
