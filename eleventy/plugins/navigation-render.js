function renderTree(entries) {
  function renderAnchor(entry) {
    // prettier-ignore
    return `<a ${this.page.url && entry.url === this.page.url ? 'class="active"' : ''} href="${entry.url}">${entry.title}</a>`
  }
  function renderChildren(entry) {
    return entry.children ? renderTree.call(this, entry.children) : ''
  }
  function renderItems(entries) {
    return entries
      .map((entry) => {
        return (
          '<li>' +
          renderAnchor.call(this, entry) +
          renderChildren.call(this, entry) +
          '</li>'
        )
      }, this)
      .join('\n')
  }

  return '<ul>' + renderItems.call(this, entries) + '</ul>'
}

function filter(render, entries) {
  if (!entries.length) return ''

  if (
    entries.length &&
    entries[0].pluginType !== 'eleventy-navigation'
  ) {
    throw new Error(
      `Incorrect argument passed to navigation render filter. You must call \`eleventyNavigation\` or \`eleventyNavigationBreadcrumb\` first, like: \`collection.all | eleventyNavigation | renderTree | safe\``
    )
  }

  return render.call(this, entries)
}

module.exports = function (eleventyConfig) {
  eleventyConfig.addFilter('renderTree', function (entries) {
    return filter.call(this, renderTree, entries)
  })
}
