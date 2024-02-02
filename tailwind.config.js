module.exports = {
  presets: [require('@redbrick/design-system/tailwind')],
  content: [
    './src/site/_includes/**/*.{html,md,js,liquid,njk}',
    './utils/**/*.js',
  ],
}
