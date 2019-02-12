export function focusElement(node, collapse) {
  const range = document.createRange()
  range.selectNodeContents(node)
  range.collapse(collapse)
  const selection = window.getSelection()
  selection.removeAllRanges()
  selection.addRange(range)
  range.detach()
}

export function processBlock(tag, pattern) {
  const el = window.getSelection()
  if (el.anchorNode && el.anchorNode.nodeType === 3) {
    if (pattern.test(el.anchorNode.textContent)) {
      document.execCommand('formatBlock', false, tag)
    }
  }
}

export function processFormatting(tag, style, pattern) {
  const el = window.getSelection()
  if (el.focusNode) {
    // Don't process already processed elements
    if (el.focusNode.parentElement.tagName === tag.toUpperCase()) {
      return
    }
    if (el.focusNode.nodeType === 3 && el.focusNode.textContent) {
      let patternMatch
      while ((patternMatch = pattern.exec(el.focusNode.textContent)) != null) {
        if (el.focusNode.parentElement.tagName !== tag.toUpperCase()) {
          // Create the range to select
          const range = document.createRange()
          range.setStart(el.focusNode, patternMatch.index)
          // grab before the trailing whitespace
          range.setEnd(el.focusNode, pattern.lastIndex - 1)
          // Create the new selection
          el.removeAllRanges()
          el.addRange(range)
          // Format that selection
          document.execCommand(style, false)
          // For Firefox, remove that fucking BR
          if (
            el.focusNode.parentNode.nextElementSibling &&
            el.focusNode.parentNode.nextElementSibling.nodeName === 'BR'
          ) {
            el.focusNode.parentNode.nextElementSibling.remove()
          }
          focusElement(el.focusNode.parentNode.parentNode, false)
        }
      }
    }
  }
}
