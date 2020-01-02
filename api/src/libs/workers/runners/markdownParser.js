const { parentPort, workerData } = require('worker_threads')
const md = require('markdown-it')()
const processTokens = require('../../markdownProcessor')

function processMarkdownSync(rawMarkdown) {
  const result = md.parse(rawMarkdown, {})
  return processTokens(result)
}

parentPort.postMessage(processMarkdownSync(workerData[0]))