const TocPlugin = require('eleventy-plugin-toc')
const slugifyUrl = require('./utils/filters/slugify-url')
const md = require('./utils/filters/markdown')

module.exports = function (eleventyConfig) {
  eleventyConfig.addPlugin(TocPlugin, {
    tags: ['h2', 'h3', 'h4'],
  })

  eleventyConfig.addFilter('slugifyUrl', slugifyUrl)
  eleventyConfig.addFilter('markdown', md)

  eleventyConfig.addPassthroughCopy('import-map.json')
  eleventyConfig.addPassthroughCopy('assets/favicon.ico')

  eleventyConfig.setNunjucksEnvironmentOptions({
    throwOnUndefined: true,
    autoescape: false,
  })

  return {
    dir: {
      input: 'src',
      output: 'dist',
    },
  }
}
