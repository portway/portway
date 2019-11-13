/**
 * Token processor for markdown-it library tokens
 *
 * Converts MarkdownIt Tokens to baller Portway structure which is more baller
 */

export default (markdownItTokens) => {
  if (!Array.isArray(markdownItTokens)) {
    throw new Error('must pass array of markdown-it tokens')
  }

  return parseTokens(markdownItTokens)
}

function parseTokens(tokens) {
  // Each call to parseTokens is going to return zero or more
  // parsedTokens
  const parsedTokens = []

  for (let i = 0; i < tokens.length; i++) {
    const token = tokens[i]
    const parsedToken = {}

    // Add any attributes
    // Attributes looks like "attrs": [ [attrName, attrValue], ...]
    // Reformats to "attrs": { [name]: value }
    if (Array.isArray(token.attrs) && token.attrs.length > 0) {
      parsedToken.attrs = token.attrs.reduce((attrs, attr) => {
        attrs[attr[0]] = attr[1]
        return attrs
      }, {})
    }

    // Step 1) Check if it's an opening tag

    // exec changes state of regex, so need new regex
    // for each invocation of exec()
    const openTagRegEx = RegExp('(.*)_open$', 'g')
    const result = openTagRegEx.exec(token.type)
    if (result && result[1]) {
      const closeSubIndex = findClosingTagIndex(
        result[1],
        tokens.slice(i + 1, tokens.length)
      )
      // The closeSubIndex is calculated based on the current index
      // of the token array being 0. So translate the subIndex back to the
      // full token array's index
      const closeIndex = closeSubIndex + i + 1
      const children = parseTokens(tokens.slice(i + 1, closeIndex))

      // For unknown reasons, markdownit sometimes adds hidden
      // paragraph tokens, like on a list element: `<ul><li><p>text</p></li></ul>`
      // Remove it, so we output: `<ul><li>text</li>`
      if (token.hidden) {
        parsedTokens.push(...children)
      } else {
        parsedToken.type = 'tag'
        parsedToken.tag = token.tag
        parsedToken.children = children
        parsedTokens.push(parsedToken)
      }

      // Special case for open tags nests all tokens enclosed as children,
      // breaks out of this loop and concatenates all tokens past the close
      // tag onto the parsedTokens array
      return parsedTokens.concat(
        parseTokens(tokens.slice(closeIndex + 1, tokens.length))
      )
    }

    // Step 2) See if it has children
    if (Array.isArray(token.children) && token.children.length > 0) {
      const children = parseTokens(token.children)
      if (children.length > 0) {
        // Children are appended at the same level and not nested
        // because markdown-it wraps children in a special "inline"
        // element we don't care about
        parsedTokens.push(...children)
      }
    }

    // Step 3) Add it to the parsedArray, like the champ it is

    // Text type
    if (token.type === 'text' && token.content && token.content.length > 0) {
      parsedToken.type = 'text'
      parsedToken.data = token.content
      parsedTokens.push(parsedToken)
    }

    // Break type
    if (token.type === 'softbreak') {
      parsedToken.type = 'tag'
      parsedToken.tag = 'br'
      parsedTokens.push(parsedToken)
    }

    // Step 4) Ignore it, if it hasn't matched any of the above conditions
  }

  return parsedTokens
}

function findClosingTagIndex(type, tokens) {
  // Need to check if there are the same tag types nested
  // eg <div>yo<div>nested yo</div></div>
  let nestedOpenTags = 0
  let nestedCloseTags = 0
  for (let i = 0; i < tokens.length; i++) {
    const token = tokens[i]

    if (token.type === `${type}_open`) {
      nestedOpenTags += 1
    }

    if (token.type === `${type}_close`) {
      if (nestedOpenTags === nestedCloseTags) {
        // Found the matching close tag index
        return i
      } else {
        nestedCloseTags += 1
      }
    }
  }
  // Well this is embarassing, you got no close tag,
  // so just wrap everything in the tag
  console.info('processTokens: no closing index found')
  return tokens.length - 1
}