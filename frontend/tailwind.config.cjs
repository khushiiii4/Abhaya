module.exports = {
  content: ["./index.html", "./src/**/*.{js,jsx}"] ,
  theme: {
    extend: {
      colors: {
        primary: '#594BA0',
        secondary: '#625D73',
        accent: '#86819E',
        'purple-soft': '#86819E',
        background: {
          top: '#FBFAFB',
          mid: '#F5F4F6',
          bottom: '#EFEEF1',
        },
        text: {
          heading: '#261F32',
          secondary: '#41394F',
          muted: '#625D73',
        },
        sos: {
          primary: '#FF3B30',
          light: '#F64F59',
          lighter: '#FF6B6B',
        }
      },
      backgroundImage: {
        'gradient-primary': 'linear-gradient(135deg, #594BA0, #86819E)',
        'gradient-bg': 'linear-gradient(135deg, #FBFAFB, #F5F4F6, #EFEEF1)',
        'gradient-sos': 'linear-gradient(135deg, #FF3B30, #F64F59)',
      },
      boxShadow: {
        'glass': '0 18px 45px rgba(89, 75, 160, 0.15)',
        'soft': '0 4px 20px rgba(89, 75, 160, 0.12)',
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
