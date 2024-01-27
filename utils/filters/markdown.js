const { parse, join } = require('path')
const frontMatter = require('markdown-it-front-matter')
const replaceLink = require('markdown-it-replace-link')
const anchor = require('markdown-it-anchor')
const slugifyUrl = require('./slugify-url')

const md = require('markdown-it')({
  html: true,
  breaks: true,
  linkify: true,
  typographer: true,
})

md.use(anchor, {
  level: [2, 3, 4],
  tabIndex: false,
  permalink: anchor.permalink.headerLink({
    class: 'not-prose anchor',
    style: 'aria-labelledby',
  }),
})

md.use(replaceLink, {
  processHTML: true,
  replaceLink: function (link, _env, _token, _htmlToken) {
    const externalLink = /https?:\/\/((?:[\w\d-]+\.)+[\w\d]{2,})/i
    if (externalLink.test(link)) return // do not process external links

    link = decodeURIComponent(link) // remove percent encoding
    const parsed = parse(link)
    link = join(parsed.dir, parsed.name) // remove extension

    return slugifyUrl(link)
  },
})

md.use(frontMatter, () => {})

module.exports = (str) => md.render(str)
