const path = require('path')
const { writeFile } = require('fs/promises')

const debug = require('debug')
const simpleGit = require('simple-git')
const { rimraf } = require('rimraf')

module.exports = function (
  eleventyConfig,
  opts = {
    repos: [],
    debug: false,
    clean: true,
  }
) {
  const cleanBuilds = (dir) => {
    return rimraf(
      opts.repos.map((repo) => path.join(dir.input, repo))
    )
  }
  const buildGitUrl = (repo) => {
    return `git@github.com:redbrick/${repo}.git`
  }
  const buildDataFile = (repo) => {
    return JSON.stringify({
      layout: 'layouts/' + repo,
      tags: repo,
    })
  }
  const buildDataFilename = (dir, repo) => {
    return path.join(dir.input, repo, repo + '.11tydata.json')
  }

  eleventyConfig.on('eleventy.before', async ({ dir }) => {
    await cleanBuilds(dir)

    const git = simpleGit({
      baseDir: dir.input,
    })

    if (opts.debug) debug.enable('simple-git')

    await Promise.all(
      opts.repos.map(async (repo) => {
        // clone git repo into input dir
        await git.clone(buildGitUrl(repo), [
          '--single-branch',
          '--depth=1',
        ])
        // write directory data file into repo
        await writeFile(
          buildDataFilename(dir, repo),
          buildDataFile(repo),
          'utf8'
        )
      })
    )
  })

  if (opts.clean) {
    eleventyConfig.on('eleventy.after', ({ dir }) => cleanBuilds(dir))
  }
}
