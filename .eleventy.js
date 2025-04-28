const path = require('path')
const fs = require('fs')
const yaml = require('js-yaml')
const { DateTime } = require('luxon')
const readingTime = require('reading-time')
const tocPlugin = require('eleventy-plugin-toc')
const postcssPlugin = require('eleventy-plugin-postcss')
const eleventyNavigationPlugin = require('@11ty/eleventy-navigation')

const gitBuildPlugin = require('./eleventy/plugins/git-build')
const pagefindPlugin = require('./eleventy/plugins/pagefind')
const navigationRenderPlugin = require('./eleventy/plugins/navigation-render')
const markdown = require('./eleventy/parsers/markdown')
const slugify = require('./eleventy/filters/slugify')

const pkg = require('./package.json')

module.exports = function (eleventyConfig) {
  eleventyConfig.setUseGitIgnore(false)

  eleventyConfig.addDataExtension('yml, yaml', (contents) =>
    yaml.load(contents)
  )

  eleventyConfig.addPassthroughCopy('import-map.json')
  eleventyConfig.addPassthroughCopy(
    path.join(
      pkg.eleventy.dir.input,
      'assets',
      '/**/[!_]*.{png,jpg,jpeg,webp,svg,gif,bmp,ico}'
    )
  )

  function includeMarkdown(filePath) {
    filePath = String(filePath)
    const fullPath = path.resolve(process.cwd(), filePath)
    let mdContent
    try {
      mdContent = fs.readFileSync(fullPath, "utf8")
    } catch (err) {
      console.error(`Error reading file at: ${fullPath}`, err)
      return `<p>Error reading file at: ${fullPath}</p>`
    }
    return markdown.render(mdContent)
  }

  // Register as a shortcode for content files
  eleventyConfig.addShortcode("includeMarkdown", includeMarkdown)
  // Also register as a Nunjucks global so includes have access to it
  eleventyConfig.addNunjucksGlobal("includeMarkdown", includeMarkdown)


  eleventyConfig.addPlugin(gitBuildPlugin, {
    repos: [
      { name: 'blog' },
      { name: 'open-governance' },
    ],
    clean: false,
  })
  eleventyConfig.addPlugin(pagefindPlugin)
  eleventyConfig.addPlugin(postcssPlugin)
  eleventyConfig.addPlugin(eleventyNavigationPlugin)
  eleventyConfig.addPlugin(navigationRenderPlugin)
  eleventyConfig.addPlugin(tocPlugin, {
    tags: ['h2', 'h3', 'h4'],
    wrapperClass: 'menu',
    ul: true,
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
