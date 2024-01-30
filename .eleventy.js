const tocPlugin = require('eleventy-plugin-toc')
const proseFilter = require('./utils/prose')

module.exports = function (eleventyConfig) {
  eleventyConfig.addPlugin(tocPlugin, {
    tags: ['h2', 'h3', 'h4'],
  })

  eleventyConfig.addFilter('prose', proseFilter)
  eleventyConfig.addFilter('blobsToNavigation', (list) =>
    list.reduce((rv, x) => {
      ;(rv[x['parent']] = rv[x['parent']] || []).push(x)
      return rv
    }, {})
  )

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
