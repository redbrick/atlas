const path = require('path')
const { DateTime } = require('luxon')
const readingTime = require('reading-time')
const tocPlugin = require('eleventy-plugin-toc')
const navigationPlugin = require('@11ty/eleventy-navigation')

const gitHookPlugin = require('./utils/plugins/git-hook')
const postcssHookPlugin = require('./utils/plugins/postcss-hook')
const markdown = require('./utils/parsers/markdown')
const slugify = require('./utils/filters/slugify')

module.exports = function (eleventyConfig) {
  const config = {
    dir: {
      input: 'src/content',
      output: 'dist',
      data: '../_data',
      includes: '../_includes',
    },
    templateFormats: ['njk', 'md', 'html'],
    htmlTemplateEngine: 'njk',
    markdownTemplateEngine: 'njk',
  }

  eleventyConfig.setUseGitIgnore(false)

  eleventyConfig.addGlobalData('permalink', () => (data) => {
    const inputDepth = config.dir.input.split('/').length
    const filePath = data.page.inputPath
      .split('/')
      .slice(inputDepth + 1)
      .join('/')

    return `/${slugify(filePath)}.${data.page.outputFileExtension}`
  })

  eleventyConfig.addGlobalData('eleventyComputed', () => {
    return {
      permalink: (data) => (data.hidden ? false : data.permalink),
      eleventyExcludeFromCollections: (data) => data.hidden,
      eleventyNavigation: {
        title: (data) => data.title,
        key: (data) =>
          data.page.url
            ? data.page.url.replace(/\/+$/, '')
            : undefined,
        parent: (data) => {
          const parent = data.page.url
            ? path.join(data.page.url, '..')
            : undefined
          return parent != '/' ? parent : undefined
        },
      },
    }
  })

  eleventyConfig.addPassthroughCopy('import-map.json')

  eleventyConfig.addPlugin(gitHookPlugin, {
    repos: [{ name: 'blog' }, { name: 'open-governance' }],
    clean: false,
  })
  eleventyConfig.addPlugin(postcssHookPlugin, {
    input: path.join(config.dir.input, 'assets/main.css'),
    output: 'assets/main.css',
  })
  eleventyConfig.addPlugin(navigationPlugin)
  eleventyConfig.addPlugin(tocPlugin, {
    tags: ['h2', 'h3', 'h4'],
  })

  eleventyConfig.addFilter('slugify', slugify)
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

  eleventyConfig.setLibrary('md', markdown)

  eleventyConfig.setNunjucksEnvironmentOptions({
    throwOnUndefined: true,
    autoescape: false,
  })

  return config
}
