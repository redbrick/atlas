module.exports = {
  presets: [require('@redbrick/design-system/tailwind')],
  content: ['./src/**/*.{html,md,njk,js,css}', './utils/**/*.js'],
  plugins: [require('@xpd/tailwind-3dtransforms')],
}
