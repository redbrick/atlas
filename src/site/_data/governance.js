const { getMarkdown } = require('../../../utils/github')

module.exports = async () => {
  const data = await getMarkdown('open-governance', {
    exclude: ['README', 'Style Guide'],
  })
  return data
}
