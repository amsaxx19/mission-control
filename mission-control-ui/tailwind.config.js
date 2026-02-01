/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        paper: '#faf9f7',
        ink: '#1a1a1a',
        muted: '#6b6b6b',
        accent: '#c9a227',
        'accent-light': '#e8d5a3',
        success: '#2d5a3d',
        warning: '#b8860b',
        danger: '#8b4513',
        kanban: {
          inbox: '#f5f5f5',
          assigned: '#e3f2fd',
          progress: '#fff3e0',
          review: '#f3e5f5',
          done: '#e8f5e9'
        }
      },
      fontFamily: {
        serif: ['Georgia', 'Cambria', 'Times New Roman', 'serif'],
        sans: ['system-ui', '-apple-system', 'sans-serif'],
      }
    },
  },
  plugins: [],
}