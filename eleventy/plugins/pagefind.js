const { execSync } = require('child_process')

module.exports = function (eleventyConfig) {
  eleventyConfig.on('eleventy.after', () => {
    execSync(
      `yarn pagefind --site ${eleventyConfig.dir.output} --output-subdir _pagefind --glob "**/*.html"`,
      { encoding: 'utf-8' }
    )
  })
}
