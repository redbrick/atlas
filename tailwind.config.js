module.exports = {
  presets: [require('@cspp/identityflip/tailwind')],
  content: ['./src/**/*.{html,md,njk,js,css}', './utils/**/*.js'],
  plugins: [require('@xpd/tailwind-3dtransforms')],
}
