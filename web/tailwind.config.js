/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#e7fbfe',
          100: '#c5f4fb',
          200: '#95e9f5',
          300: '#5ddbee',
          400: '#2ccde6',
          500: '#22d3ee',
          600: '#18adc7',
          700: '#13879b',
          800: '#0f6673',
          900: '#0b4a53',
        },
        dark: {
          100: '#2a2f38',
          200: '#1a1f27',
          300: '#141820',
          400: '#0f1217',
          500: '#07080a',
        }
      },
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'gradient-primary': 'linear-gradient(135deg, #22d3ee 0%, #a855f7 100%)',
        'gradient-dark': 'linear-gradient(135deg, #07080a 0%, #141820 60%, #0f1217 100%)',
      },
    },
  },
  plugins: [],
}
