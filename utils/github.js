const { Octokit } = require('@octokit/rest')
const { parse, join } = require('path')
const yaml = require('yaml')

const markdownIt = require('markdown-it')
const frontMatter = require('markdown-it-front-matter')
const replaceLink = require('markdown-it-replace-link')
const anchor = require('markdown-it-anchor')
const slugifyUrl = require('./slugify-url')

const GITHUB_RAW_URL = 'https://raw.githubusercontent.com/redbrick'

const octokit = new Octokit()

const parseMarkdown = (str) => {
  let fm = {}
  const rendered = markdownIt({
    html: true,
    breaks: true,
    linkify: true,
    typographer: true,
  })
    .use(anchor, {
      level: [2, 3, 4],
      tabIndex: false,
      permalink: anchor.permalink.headerLink({
        class: 'not-prose anchor',
        style: 'aria-labelledby',
      }),
    })
    .use(replaceLink, {
      processHTML: true,
      replaceLink: function (link, _env, _token, _htmlToken) {
        const externalLink = /https?:\/\/((?:[\w\d-]+\.)+[\w\d]{2,})/i
        if (externalLink.test(link)) return link // do not process external links

        if (
          link.startsWith('..') ||
          (link.split('/').length == 1 && !link.startsWith('#'))
        )
          link = join('..', link)

        link = decodeURIComponent(link) // remove percent encoding
        const parsed = parse(link)
        link = join(parsed.dir, parsed.name) // remove extension

        return slugifyUrl(link)
      },
    })
    .use(frontMatter, (meta) => {
      fm = yaml.parse(meta)
    })
    .render(str)

  return {
    ...fm,
    content: rendered,
  }
}

const request = (endpoint, options) =>
  octokit.request(endpoint, {
    ...options,
    headers: {
      'X-GitHub-Api-Version': '2022-11-28',
    },
  })

const getTree = async function (
  repo,
  {
    path = '',
    extension = null,
    recursive = true,
    exclude = [],
    includeFolders = false,
  } = {}
) {
  const repoResponse = await request('GET /repos/redbrick/{repo}', {
    repo,
  })

  const { default_branch } = repoResponse.data

  const filesResponse = await octokit.request(
    'GET /repos/redbrick/{repo}/git/trees/{branch}:{path}',
    {
      repo,
      branch: default_branch,
      path,
      recursive,
      headers: {
        'X-GitHub-Api-Version': '2022-11-28',
      },
    }
  )

  const files = filesResponse.data.tree.filter((item) => {
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
        GITHUB_RAW_URL,
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
    path = '',
    recursive = true,
    exclude = ['README', 'LICENSE', 'CONTRIBUTING'],
    includeFolders = false,
  } = {}
) {
  const files = await getTree(repo, {
    path,
    recursive,
    exclude,
    includeFolders,
    extension: '.md',
  })

  return files.map((file) => ({
    ...file,
    ...parseMarkdown(file.content),
  }))
}

module.exports = {
  getMarkdown,
}
