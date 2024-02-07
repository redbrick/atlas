const path = require('path')
const { DateTime } = require('luxon')
const readingTime = require('reading-time')
const tocPlugin = require('eleventy-plugin-toc')
const postcssPlugin = require('eleventy-plugin-postcss')
const navigationPlugin = require('@11ty/eleventy-navigation')

const gitBuildPlugin = require('./utils/plugins/git-build')
const pagefindPlugin = require('./utils/plugins/pagefind')
const markdown = require('./utils/parsers/markdown')
const slugify = require('./utils/filters/slugify')

const pkg = require('./package.json')

module.exports = function (eleventyConfig) {
  eleventyConfig.setUseGitIgnore(false)

  eleventyConfig.addPassthroughCopy('import-map.json')
  eleventyConfig.addPassthroughCopy(
    path.join(
      pkg.eleventy.dir.input,
      'assets',
      '/**/[!_]*.{png,jpg,jpeg,webp,svg,gif,bmp,ico}'
    )
  )

  eleventyConfig.addPlugin(gitBuildPlugin, {
    repos: [{ name: 'blog' }, { name: 'open-governance' }],
    clean: false,
  })
  eleventyConfig.addPlugin(pagefindPlugin)
  eleventyConfig.addPlugin(postcssPlugin)
  eleventyConfig.addPlugin(navigationPlugin)
  eleventyConfig.addPlugin(tocPlugin, {
    tags: ['h2', 'h3', 'h4'],
  })

  eleventyConfig.addFilter('slugify', slugify)
  eleventyConfig.addFilter('readable', (date) => {
    return DateTime.fromJSDate(date).toLocaleString(
      DateTime.DATE_FULL
    )
  })
  eleventyConfig.addFilter('readingTime', (str) => {
    return readingTime(str, { wordsPerMinute: 250 }).text
  })

  eleventyConfig.addWatchTarget('postcss.config.js')
  eleventyConfig.addWatchTarget('tailwind.config.js')

  eleventyConfig.setLibrary('md', markdown)

  eleventyConfig.setNunjucksEnvironmentOptions({
    throwOnUndefined: true,
    autoescape: false,
  })

  return pkg.eleventy
}
