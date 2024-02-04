const slugify = require('slugify')
const { splitExtension } = require('../urls')

const options = {
  lower: true,
  strict: true,
  remove: /["]/g,
}

module.exports = function (str, opts = {}) {
  if (!str) return

  // remove percent encoding
  str = decodeURIComponent(str)

  // if link is an intra-document anchor, return slug
  if (str.startsWith('#')) return '#' + slugify(str, options)

  // split link into file path, extension & anchor
  const [base, ext, anchor] = splitExtension(str)

  str = base
    .split('/')
    .map((segment) => {
      // do not process '.' or '..'
      if (/^[\.]+$/.test(segment)) return segment

      return slugify(segment, options)
    })
    .join('/')

  if (opts.includeExtension) str += ext
  if (anchor) str += '#' + slugify(anchor, options)

  return str
}
