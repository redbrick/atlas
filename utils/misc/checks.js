/**
 * @param {String} link
 */
const isExternalLink = (link) =>
  /https?:\/\/((?:[\w\d-]+\.)+[\w\d]{2,})/i.test(link)

module.exports = {
  isExternalLink,
}
