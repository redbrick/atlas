const slugify = require('slugify')
const { splitExtension } = require('../utils/urls')

const options = {
  lower: true,
  strict: true,
  remove: /["]/g,
}

module.exports = function (str) {
  if (!str) return

  // remove percent encoding
  str = decodeURIComponent(str)

  // if link is an intra-document anchor, return slug
  if (str.startsWith('#')) return '#' + slugify(str, options)

  const { filepath, ext, anchor } = splitExtension(str)

  str = filepath
    .split('/')
    .map((segment) => {
      // do not process '.' or '..'
      if (/^[\.]+$/.test(segment)) return segment

      return slugify(segment, options)
    })
    .join('/')

  str += ext === '.md' ? '.html' : ext
  if (anchor) str += '#' + slugify(anchor, options)

  return str
}
