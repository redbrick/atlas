const path = require('path')
const { rimraf } = require('rimraf')
const { writeFile } = require('fs/promises')
const simpleGit = require('simple-git')
const debug = require('debug')
const { DateTime } = require('luxon')
const readingTime = require('reading-time')
const tocPlugin = require('eleventy-plugin-toc')
const proseFilter = require('./utils/prose')

module.exports = function (eleventyConfig) {
  const config = {
    dir: {
      input: 'src/site/content',
      output: 'dist',
      data: '../_data',
      includes: '../_includes',
    },
    templateFormats: ['njk', 'md', 'html'],
    htmlTemplateEngine: 'njk',
    markdownTemplateEngine: 'njk',
  }

  const repos = ['blog', 'open-governance']

  const cleanRepos = (dir) =>
    rimraf(repos.map((repo) => path.join(dir.input, repo)))

  eleventyConfig.watchIgnores.add(
    `${config.dir.input}/{${repos.join(',')}}/**`
  )

  eleventyConfig.on('eleventy.before', async ({ dir }) => {
    await cleanRepos(dir)

    const git = simpleGit({
      baseDir: dir.input,
    })

    debug.enable('simple-git')

    const url = (repo) => `git@github.com:redbrick/${repo}.git`
    const data = (repo) =>
      JSON.stringify({
        layout: 'layouts/' + repo,
      })
    const filename = (repo) =>
      path.join(dir.input, repo, repo + '.11tydata.json')

    await Promise.all(
      repos.map(async (repo) => {
        await git.clone(url(repo), ['--single-branch', '--depth=1'])
        await writeFile(filename(repo), data(repo), 'utf8')
      })
    )
  })

  eleventyConfig.on('eleventy.after', ({ dir }) => cleanRepos(dir))

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

  return config
}
