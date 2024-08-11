const path = require('path')

module.exports = () => {
  const getUrl = (data) => {
    const url = data.page.url
    if (!url) return null
    // return splitExtension(url).filepath
    return url
  }

  const getKey = (data) => {
    const url = getUrl(data)
    if (!url) return null
    if (data.index) return path.join(url, '..')
    return url
  }

  const getParent = (data) => {
    if (!data.page.url) return null
    let parent = path.join(data.page.url, '..')
    if (data.index) parent = path.join(parent, '..')
    if (parent == '/') parent = null
    return parent
  }

  return {
    permalink: (data) => {
      if (data.hidden) {
        return false
      }
      return data.permalink
    },
    eleventyExcludeFromCollections: (data) => data.hidden,
    eleventyNavigation: {
      title: (data) => data.title,
      url: getUrl,
      key: getKey,
      parent: getParent,
    },
  }
}
