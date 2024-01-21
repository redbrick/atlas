module.exports = function (eleventyConfig) {
  eleventyConfig.setNunjucksEnvironmentOptions({
    throwOnUndefined: true,
    autoescape: false,
  })

  eleventyConfig.addPassthroughCopy('import-map.json')
  eleventyConfig.addPassthroughCopy('src/assets/favicon.ico')

  return {
    dir: {
      input: 'src',
      output: 'dist',
    },
  }
}
