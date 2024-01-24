const frontmatter = require('markdown-it-front-matter')
const anchor = require('markdown-it-anchor')

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

md.use(frontmatter, () => {})

module.exports = md
