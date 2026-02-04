module.exports = {
  presets: [require('@redbrick/design-system/tailwind')],
  content: ['./src/**/*.{html,md,njk,js,css}', './utils/**/*.js'],
  plugins: [require('@xpd/tailwind-3dtransforms')],
  theme: {
    extend: {
      animation: {
        fall: 'fall 8s linear infinite',
        'fall-soft-blink': 'fall-soft-blink 14s linear infinite', // Merged animation
      },
      keyframes: {
        fall: {
          '0%': { transform: 'translateY(-10vh)', opacity: '0' },
          '10%': { opacity: '1' },
          '100%': { transform: 'translateY(110vh)', opacity: '0' },
        },
        'fall-soft-blink': {
          '0%': { transform: 'translateX(-1vw) translateY(-10vh)', opacity: '0.3' },
          '10%': { transform: 'translateX(-0.5vw) translateY(5vh)', opacity: '1' },
          '30%': { transform: 'translateX(0vw) translateY(30vh)', opacity: '0.5' },
          '50%': { transform: 'translateX(0.5vw) translateY(50vh)', opacity: '1' },
          '70%': { transform: 'translateX(1vw) translateY(70vh)', opacity: '0.4' },
          '90%': { transform: 'translateX(0.5vw) translateY(90vh)', opacity: '1' },
          '100%': { transform: 'translateX(-1vw) translateY(130vh)', opacity: '0.3' },
        },
      },
    },
  }
}
