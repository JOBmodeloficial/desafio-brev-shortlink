import type { Config } from 'tailwindcss';

export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        bg: '#21222C',
        surface: '#282A36',
        'surface-2': '#343746',
        border: '#44475A',
        fg: '#F8F8F2',
        subtle: '#C3C8E0',
        muted: '#6272A4',
        purple: '#BD93F9',
        'purple-soft': '#CAA9FA',
        cyan: '#8BE9FD',
        red: '#FF5555',
        green: '#50FA7B',
        yellow: '#F1FA8C',
      },
      fontFamily: {
        sans: ["'Open Sans'", 'ui-sans-serif', 'system-ui', 'sans-serif'],
      },
      fontSize: {
        xs: '10px',
        sm: '12px',
        md: '14px',
        lg: '18px',
        xl: '24px',
      },
      borderRadius: {
        DEFAULT: '8px',
      },
    },
  },
  plugins: [],
} satisfies Config;
