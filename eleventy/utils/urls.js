const path = require('path')

const isExternalUrl = (url) =>
  /https?:\/\/((?:[\w\d-]+\.)+[\w\d]{2,})/i.test(url)

const isAbsoluteUrl = (url) => /^[a-zA-Z][a-zA-Z\d+\-.]*?:/.test(url)

const splitExtension = (url) => {
  const parsed = path.parse(url)
  const filepath = path.join(parsed.dir, parsed.name)
  const [ext, anchor] = parsed.ext.includes('#')
    ? parsed.ext.split('#')
    : [parsed.ext, '']

  return { filepath, ext, anchor }
}

module.exports = {
  isExternalUrl,
  isAbsoluteUrl,
  splitExtension,
}
