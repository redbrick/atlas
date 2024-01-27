const TocPlugin = require('eleventy-plugin-toc')

module.exports = function (eleventyConfig) {
  eleventyConfig.addPlugin(TocPlugin, {
    tags: ['h2', 'h3', 'h4'],
  })

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
