const { getMarkdown } = require('../../../utils/github')

module.exports = async () => {
  const data = await getMarkdown('blog')
  return data.reverse()
}
