import MarkdownIt from 'markdown-it'
import processTokens from '../libs/markdownProcessor'

const md = new MarkdownIt()

export default (rawMarkdown) => {
  const result = md.parse(rawMarkdown, {})
  return processTokens(result)
}