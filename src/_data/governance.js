const { getMarkdown } = require('../../utils/github')

module.exports = async () =>
  getMarkdown('open-governance', {
    exclude: ['README', 'Style Guide'],
  })
