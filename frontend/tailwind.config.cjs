module.exports = {
  content: ["./index.html", "./src/**/*.{js,jsx}"] ,
  theme: {
    extend: {
      colors: {
        primary: '#C471ED',
        secondary: '#F64F59',
        accent: '#E0BBE4',
        'purple-soft': '#A892CD',
        background: {
          top: '#FDFAFF',
          mid: '#F9F5FF',
          bottom: '#F5EFFF',
        },
        text: {
          heading: '#1A1A1A',
          secondary: '#2D2D2D',
          muted: '#4A4A4A',
        },
        sos: {
          primary: '#FF3B30',
          light: '#F64F59',
          lighter: '#FF6B6B',
        }
      },
      backgroundImage: {
        'gradient-primary': 'linear-gradient(135deg, #F64F59, #C471ED)',
        'gradient-bg': 'linear-gradient(135deg, #FDFAFF, #F9F5FF, #F5EFFF)',
        'gradient-sos': 'linear-gradient(135deg, #FF3B30, #F64F59)',
      },
      boxShadow: {
        'glass': '0 18px 45px rgba(0, 0, 0, 0.25)',
        'soft': '0 4px 20px rgba(196, 113, 237, 0.15)',
      },
      animation: {
        'pulse-slow': 'pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'pulse-ring': 'pulseRing 2s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'pulse-ring-delayed': 'pulseRing 2s cubic-bezier(0.4, 0, 0.6, 1) infinite 0.5s',
      },
      keyframes: {
        pulseRing: {
          '0%': { transform: 'scale(1)', opacity: '0.8' },
          '100%': { transform: 'scale(1.5)', opacity: '0' },
        }
      }
    },
  },
  plugins: [],
}
