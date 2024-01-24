const { Octokit } = require('@octokit/rest')
const config = require('../../config.json')

const excludedMd = ['README', 'LICENSE', 'CONTRIBUTING']
const octokit = new Octokit()

const getRepoMarkdown = async function (repo) {
  const repoConfig = config.github.repos[repo]

  const response = await octokit.request(
    'GET /repos/{owner}/{repo}/git/trees/{tree_sha}',
    {
      owner: 'redbrick',
      repo,
      tree_sha: repoConfig.sha,
      recursive: true,
      headers: {
        'X-GitHub-Api-Version': '2022-11-28',
      },
    }
  )

  const files = response.data.tree.filter(
    (item) =>
      item.type == 'blob' &&
      item.path.endsWith('.md') &&
      !excludedMd.some((excludedName) =>
        item.path.includes(excludedName)
      )
  )

  return await Promise.all(
    files.map(async (doc) => {
      const url = [
        config.github.urls.raw,
        repo,
        repoConfig.defaultBranch,
        doc.path,
      ].join('/')

      const content = await fetch(url).then((res) => res.text())
      const path = doc.path.slice(0, -3)

      return {
        title: path.split('/').pop(),
        path: path,
        url,
        content,
      }
    })
  )
}

module.exports = {
  getRepoMarkdown,
}
