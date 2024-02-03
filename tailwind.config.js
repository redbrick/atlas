module.exports = {
  presets: [require('@redbrick/design-system/tailwind')],
  content: [
    './src/_includes/**/*.{html,md,js,liquid,njk}',
    './utils/**/*.js',
  ],
}
