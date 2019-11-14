import MarkdownIt from 'markdown-it'
import processTokens from '../libs/markdownProcessor'
import workerFactory from '../libs/workers/workerFactory'
import runners from '../constants/runners'

const md = new MarkdownIt()
const markdownWorker = workerFactory(runners.MARKDOWN_RUNNER)

export function processMarkdownSync(rawMarkdown) {
  const result = md.parse(rawMarkdown, {})
  return processTokens(result)
}

export async function processMarkdownWithWorker(rawMarkdown) {
  return markdownWorker(rawMarkdown)
}