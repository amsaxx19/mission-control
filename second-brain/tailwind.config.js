module.exports = {
  content: [
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        linear: {
          bg: '#0e0e10',
          sidebar: '#0e0e10',
          surface: '#141416',
          elevated: '#1c1c1f',
          border: '#2a2a2e',
          text: '#f0f0f0',
          muted: '#8a8f98',
          accent: '#5e6ad2',
          'accent-hover': '#4f5ac0',
        },
        obsidian: {
          bg: '#1e1e1e',
          sidebar: '#252526',
          surface: '#2d2d30',
          text: '#cccccc',
          muted: '#858585',
          accent: '#007acc',
        }
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        mono: ['JetBrains Mono', 'Fira Code', 'monospace'],
      },
    },
  },
  plugins: [],
}