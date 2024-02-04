const path = require('path')
const { writeFile, readdir, stat } = require('fs/promises')
const { rimraf } = require('rimraf')

const debug = require('debug')
const simpleGit = require('simple-git')

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
      opts.repos.map((repo) => path.join(dir.input, repo.name))
    )
  }
  const buildGitUrl = (name) => {
    return `git@github.com:redbrick/${name}.git`
  }
  const buildDataFile = (name) => {
    return JSON.stringify({
      layout: 'layouts/' + name,
      tags: name,
    })
  }
  const buildMetaFile = (filepath) => {
    const dir = path.parse(filepath)

    const json = JSON.stringify({
      title: dir.name,
    })

    return `---json\n${json}\n---`
  }

  eleventyConfig.on('eleventy.before', async ({ dir }) => {
    await cleanBuilds(dir)

    const git = simpleGit({
      baseDir: dir.input,
    })

    opts.debug
      ? debug.enable('simple-git')
      : debug.disable('simple-git')

    await Promise.all(
      opts.repos.map(async (repo) => {
        // clone git repo into input dir
        await git.clone(buildGitUrl(repo.name), [
          '--single-branch',
          '--depth=1',
        ])
        // write directory data file into repo
        await writeFile(
          path.join(
            dir.input,
            repo.name,
            `${repo.name}.11tydata.json`
          ),
          buildDataFile(repo.name),
          'utf8'
        )
      })
    )

    // TODO: add git information to data cascade (tag, commits, etc)

    // clean each cloned repo
    const clean = [
      '.obsidian',
      '.git',
      '.gitattributes',
      '.gitignore',
    ]
    await Promise.all(
      opts.repos.map((repo) =>
        rimraf(clean.map((f) => path.join(dir.input, repo.name, f)))
      )
    )

    // add meta-template to each folder, for navigation
    await Promise.all(
      opts.repos.map(async (repo) => {
        const root = path.join(dir.input, repo.name)

        const traverse = async function (dir) {
          writeFile(
            path.join(dir, 'index.md'),
            buildMetaFile(dir),
            'utf8'
          )

          dir = await readdir(dir)
          await Promise.all(
            dir.map(async (file) => {
              let filePath = path.join(root, file)
              let fileStat
              try {
                fileStat = await stat(filePath)
              } catch {
                return
              }

              if (fileStat.isDirectory()) await traverse(filePath)
            })
          )
        }

        await traverse(root)
      })
    )
  })

  if (opts.clean) {
    eleventyConfig.on('eleventy.after', ({ dir }) => cleanBuilds(dir))
  }

  opts.repos.forEach((repo) =>
    eleventyConfig.watchIgnores.add(
      path.join(eleventyConfig.dir.input, repo.name)
    )
  )

  eleventyConfig.addPassthroughCopy(
    path.join(
      eleventyConfig.dir.input,
      '/**/[!_]*.{png,jpg,jpeg,webp,svg,gif,bmp,ico}'
    )
  )
}
