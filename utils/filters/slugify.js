const slugify = require('slugify')

module.exports = (str) => {
  if (!str) {
    return
  }

  return str
    .split('/')
    .map((node) => {
      if (/^[\.]+$/.test(node)) return node

      return slugify(node, {
        lower: true,
        strict: true,
        remove: /["]/g,
      })
    })
    .join('/')
}
