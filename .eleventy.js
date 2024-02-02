const { DateTime } = require('luxon')
const readingTime = require('reading-time')
const tocPlugin = require('eleventy-plugin-toc')
const proseFilter = require('./utils/prose')

module.exports = function (eleventyConfig) {
  eleventyConfig.addPlugin(tocPlugin, {
    tags: ['h2', 'h3', 'h4'],
  })

  eleventyConfig.addFilter('prose', proseFilter)
  eleventyConfig.addFilter(
    'readingTime',
    (str) => readingTime(str, { wordsPerMinute: 250 }).text
  )
  eleventyConfig.addFilter('readable', (date) =>
    DateTime.fromJSDate(date).toLocaleString(DateTime.DATE_FULL)
  )
  eleventyConfig.addFilter('blobsToNavigation', (list) =>
    list.reduce((rv, x) => {
      ;(rv[x['parent']] = rv[x['parent']] || []).push(x)
      return rv
    }, {})
  )

  eleventyConfig.addPassthroughCopy('import-map.json')
  eleventyConfig.addPassthroughCopy({
    'src/assets/favicon.ico': 'assets/favicon.ico',
  })

  eleventyConfig.setNunjucksEnvironmentOptions({
    throwOnUndefined: true,
    autoescape: false,
  })

  return {
    dir: {
      input: 'src/site/content/',
      output: 'dist',
      data: '../_data',
      includes: '../_includes',
    },
    templateFormats: ['njk', 'md', 'html'],
    htmlTemplateEngine: 'njk',
    markdownTemplateEngine: 'njk',
  }
}
