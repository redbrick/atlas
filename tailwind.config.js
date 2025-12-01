module.exports = {
  presets: [require('@redbrick/design-system/tailwind')],
  content: ['./src/**/*.{html,md,njk,js,css}', './utils/**/*.js'],
  plugins: [require('@xpd/tailwind-3dtransforms')],
  theme: {
    extend: {
      animation: {
        fall: 'fall 5s linear infinite',
      },
      keyframes: {
        fall: {
          '0%': { transform: 'translateY(-10%)', opacity: '1' },
          '100%': { transform: 'translateY(110%)', opacity: '0' },
        },
      },
    },
  }
}
