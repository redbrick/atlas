const eleventyPluginTOC = require('eleventy-plugin-toc')

module.exports = function (eleventyConfig) {
  eleventyConfig.addPlugin(eleventyPluginTOC, {
    tags: ['h2', 'h3', 'h4'],
  })

  eleventyConfig.setNunjucksEnvironmentOptions({
    throwOnUndefined: true,
    autoescape: false,
  })

  eleventyConfig.addPassthroughCopy('import-map.json')
  eleventyConfig.addPassthroughCopy('assets/favicon.ico')

  return {
    dir: {
      input: 'src',
      output: 'dist',
    },
  }
}
