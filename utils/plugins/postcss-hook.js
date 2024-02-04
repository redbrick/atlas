const path = require('path')
const { readFile, writeFile } = require('fs/promises')

const postcss = require('postcss')
const postcssrc = require('postcss-load-config')

module.exports = function (eleventyConfig, opts = {}) {
  let postcssConfig = {
    options: {},
    plugins: [],
  }

  eleventyConfig.on('eleventy.before', async ({ dir }) => {
    const input = opts.input
    const output = path.join(dir.output, opts.output || input)

    try {
      postcssConfig = await postcssrc()
    } catch (error) {
      console.warn('[PostCSS]', error.message)
    }

    const { options, plugins } = postcssConfig
    const content = await readFile(input)
    const { css } = await postcss(plugins)
      .process(content, {
        ...options,
        from: input,
        to: output,
      })
      .then((result) => result)

    await writeFile(output, css, 'utf8')
  })
}
