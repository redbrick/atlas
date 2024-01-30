const path = require('path')
const markdownIt = require('markdown-it')
const replaceLink = require('markdown-it-replace-link')
const anchor = require('markdown-it-anchor')
const slugifyUrl = require('./slugify-url')

const md = markdownIt({
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
    if (externalLink.test(link)) return link // do not process external links

    if (
      link.startsWith('..') ||
      (link.split('/').length == 1 && !link.startsWith('#'))
    )
      link = path.join('..', link)

    link = decodeURIComponent(link) // remove percent encoding
    const parsed = path.parse(link)
    link = path.join(parsed.dir, parsed.name) // remove extension

    return slugifyUrl(link)
  },
})

module.exports = (str) => md.render(str)
