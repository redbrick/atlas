module.exports = function (eleventyConfig) {
  eleventyConfig.setNunjucksEnvironmentOptions({
    throwOnUndefined: true,
    autoescape: false,
  })

  eleventyConfig.addPassthroughCopy('import-map.json')

  return {
    dir: {
      input: 'src',
      output: 'dist',
    },
  }
}
