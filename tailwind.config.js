/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        primary: '#147BC9',
        'primary-soft': '#AFCDF4',
        'primary-tint': '#EEF6FF',
        ink: '#111111',
        track: '#F1F1F3',
        line: '#EDEDED',
      },
      borderRadius: {
        control: '12px',
        segment: '10px',
        btn: '10px',
        card: '8px',
      },
      height: { btn: '56px', header: '56px' },
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'sans-serif'],
      },
    },
  },
  plugins: [],
}
