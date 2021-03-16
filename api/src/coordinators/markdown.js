import MarkdownIt from 'markdown-it'
import processTokens from '../libs/markdownProcessor'

const md = new MarkdownIt()

export function processMarkdownSync(rawMarkdown) {
  const result = md.parse(rawMarkdown, {})
  return processTokens(result)
}

export function renderMarkdownSync(rawMarkdown) {
  return md.render(rawMarkdown)
}