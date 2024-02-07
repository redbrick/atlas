const slugify = require('../../utils/filters/slugify')

const pkg = require('../../package.json')

module.exports = () => (data) => {
  const inputDepth = pkg.eleventy.dir.input.split('/').length
  const filePath = data.page.inputPath
    .split('/')
    .slice(inputDepth + 1)
    .join('/')

  // return `/${slugify(filePath)}.${data.page.outputFileExtension}`
  return '/' + slugify(filePath)
}
