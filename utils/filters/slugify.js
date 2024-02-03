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
  // split url into file path, extension & anchor
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
  str += anchor ? '#' + slugify(anchor, options) : ''

  return str
}
