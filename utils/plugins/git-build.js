const path = require('path')
const { writeFile, readFile, readdir, stat } = require('fs/promises')

const debug = require('debug')
const { rimraf } = require('rimraf')
const simpleGit = require('simple-git')
const matter = require('gray-matter')
const yaml = require('js-yaml')

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
  const buildGitUrl = (repoName) => {
    return `git@github.com:redbrick/${repoName}.git`
  }
  const buildDataFile = (repoName) => {
    return JSON.stringify({
      layout: 'markdown/' + repoName,
      tags: repoName,
    })
  }
  const buildMetaFile = (filepath) => {
    const dirname = path.parse(filepath).name
    const data = yaml.dump({
      title: dirname.charAt(0).toUpperCase() + dirname.slice(1),
      index: true,
    })

    return '---\n' + data + '\n---'
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
        // merge default clone options with provided options
        const options = { '--depth': 1 }
        if (repo.branch) options['--branch'] = repo.branch
        // clone git repo into input dir
        await git.clone(buildGitUrl(repo.name), options)
        // write directory data file into repo
        await writeFile(
          path.join(
            dir.input,
            repo.name,
            `${repo.name}.11tydata.json`
          ),
          buildDataFile(repo.name),
          'utf-8'
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
      opts.repos.map(async (repo) => {
        await rimraf(
          clean.map((f) => path.join(dir.input, repo.name, f))
        )
      })
    )

    const traverseAndPopulate = async function (dirPath) {
      let indexExists = false
      const dirFiles = await readdir(dirPath)

      await Promise.all(
        dirFiles.map(async (file) => {
          const filePath = path.join(dirPath, file)
          const fileStat = await stat(filePath)

          if (fileStat.isFile()) {
            const { data } = matter(await readFile(filePath))
            if (data.index) indexExists = true
          }

          if (fileStat.isDirectory()) {
            await traverseAndPopulate(filePath)
          }
        })
      )

      if (indexExists) return

      await writeFile(
        path.join(dirPath, path.parse(dirPath).name + '.md'),
        buildMetaFile(dirPath),
        'utf-8'
      )
    }

    // populate repos with meta-template per subdir, for navigation
    await Promise.all(
      opts.repos.map(async (repo) => {
        await traverseAndPopulate(path.join(dir.input, repo.name))
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
      '/**/[!_]*.{png,jpg,jpeg,webp,svg,gif,bmp}'
    )
  )
}
