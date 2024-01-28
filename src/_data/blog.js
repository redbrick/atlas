const { getMarkdown } = require('../../utils/github')

module.exports = async () =>
  getMarkdown('blog', {
    exclude: ['README', 'main-page'],
  })
