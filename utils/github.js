const eleventyFetch = require('@11ty/eleventy-fetch')
const { parse, join } = require('path')
const frontMatter = require('front-matter')
const slugifyUrl = require('./slugify-url')

const GITHUB_RAW = 'https://raw.githubusercontent.com/redbrick'
const GITHUB_API = 'https://api.github.com'

const request = (url, options) =>
  eleventyFetch(GITHUB_API + url, {
    verbose: true,
    duration: '1h',
    type: 'json',
    ...options,
  })

const getTree = async function (
  repo,
  {
    extension = null,
    recursive = true,
    exclude = [],
    includeFolders = false,
  } = {}
) {
  const { default_branch } = await request(`/repos/redbrick/${repo}`)

  const { tree } = await request(
    `/repos/redbrick/${repo}/git/trees/${default_branch}?recursive=${recursive}`
  )

  const files = tree.filter((item) => {
    if (item.type == 'blob') {
      if (extension && parse(item.path).ext != extension) {
        return false
      }
      if (exclude.some((excluded) => item.path.includes(excluded))) {
        return false
      }
      return true
    }
    if (item.type == 'tree' && includeFolders) {
      return true
    }
    return false
  })

  return await Promise.all(
    files.map(async (file) => {
      const contentUrl = join(
        GITHUB_RAW,
        repo,
        default_branch,
        file.path
      )
      const parsed = parse(file.path)
      const path = join('/', repo, parsed.dir, parsed.name)

      const url = file.type == 'blob' ? slugifyUrl(path) : undefined
      const content =
        file.type == 'blob'
          ? await fetch(contentUrl).then((res) => res.text())
          : null

      return {
        type: file.type,
        title: path.split('/').pop(),
        parent: path.split('/').at(-2),
        url,
        content,
      }
    })
  )
}

const getMarkdown = async function (
  repo,
  {
    recursive = true,
    exclude = ['README', 'LICENSE', 'CONTRIBUTING'],
    includeFolders = false,
  } = {}
) {
  const files = await getTree(repo, {
    recursive,
    exclude,
    includeFolders,
    extension: '.md',
  })

  return files.map((file) => {
    const { attributes, bodyBegin } = frontMatter(file.content)
    const content = file.content
      .split('\n')
      .slice(bodyBegin - 1)
      .join('\n')

    return {
      ...file,
      ...attributes,
      content,
    }
  })
}

module.exports = {
  getMarkdown,
}
