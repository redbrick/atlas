const frontMatter = require('markdown-it-front-matter')
const replaceLink = require('markdown-it-replace-link')
const anchor = require('markdown-it-anchor')
const slugify = require('./slugify')
const { isExternalLink } = require('../misc/checks')

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
    if (isExternalLink(link)) return

    link = decodeURIComponent(link).replace(/\.md$/, '')
    return slugify(link)
  },
})

md.use(frontMatter, () => {})

module.exports = (str) => md.render(str)
