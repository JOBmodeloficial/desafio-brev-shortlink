import type { Config } from 'tailwindcss';

export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        // Tema claro do Figma (JobModel/Brev.ly). As chaves são mantidas do tema
        // anterior; os valores agora refletem o design oficial (grayscale + blue-base).
        bg: '#E4E6EC', // fundo da página (gray-200)
        surface: '#FFFFFF', // cards (white)
        'surface-2': '#E4E6EC', // botão secundário / botão de ícone (gray-200)
        border: '#CDCFD5', // bordas de input / divisórias (gray-300)
        fg: '#1F2025', // texto principal / títulos (gray-600)
        subtle: '#4D505C', // labels / texto de apoio (gray-500)
        muted: '#74798B', // placeholder / URL original (gray-400)
        purple: '#2C46B1', // primário / links / marca (blue-base)
        'purple-soft': '#2C4091', // hover do primário (blue-dark)
        cyan: '#2C46B1', // links inline (blue-base)
        red: '#B12C4D', // erros (danger)
        green: '#1F8B4C', // reservado
        yellow: '#B1922C', // reservado
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
