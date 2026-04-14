/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        ink: {
          0: '#0a0a0a',
          1: '#161616',
          2: '#1f1f1f',
          3: '#2a2a2a',
        },
        paper: {
          DEFAULT: '#f5f0e6',
          dim: '#c9c2b0',
          mute: '#8a8578',
        },
        kodak: '#ffb700',
        safety: '#ff3b30',
        grass: '#6ba368',
        tape: '#ffd14d',
      },
      fontFamily: {
        display: ['"Instrument Serif"', 'serif'],
        mono: ['"JetBrains Mono"', 'ui-monospace', 'monospace'],
      },
      letterSpacing: {
        tightest: '-0.035em',
      },
    },
  },
  plugins: [],
}
