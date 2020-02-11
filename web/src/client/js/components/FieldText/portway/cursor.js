// https://gist.github.com/nathansmith/86b5d4b23ed968a92fd4

// https://stackoverflow.com/a/53128599
// node_walk: walk the element tree, stop when func(node) returns false
function nodeWalk(node, func) {
  let result = func(node)
  for (node = node.firstChild; result !== false && node; node = node.nextSibling) {
    result = nodeWalk(node, func)
  }
  return result
};

export function getElementAtPosition() {
  const sel = window.getSelection()
  const node = sel.anchorNode
  return node && node.nodeType === 3 ? node.parentNode : node
}

// getCaretPosition: return [start, end] as offsets to elem.textContent that
//   correspond to the selected portion of text
//   (if start == end, caret is at given position and no text is selected)
export function getCaretPosition(elem) {
  const sel = window.getSelection()
  let caretPos = [0, 0]

  if (sel.anchorNode === elem) {
    caretPos = [sel.anchorOffset, sel.extentOffset]
  } else {
    const nodesToFind = [sel.anchorNode, sel.extentNode]
    if (!elem.contains(sel.anchorNode) || !elem.contains(sel.extentNode)) {return undefined} else {
      const found = [0, 0]
      let i
      nodeWalk(elem, (node) => {
        for (i = 0; i < 2; i++) {
          if (node === nodesToFind[i]) {
            found[i] = true
            if (found[i === 0 ? 1 : 0]) {return false} // all done
          }
        }

        if (node.textContent && !node.firstChild) {
          for (i = 0; i < 2; i++) {
            if (!found[i]) {caretPos[i] += node.textContent.length}
          }
        }
      })
      caretPos[0] += sel.anchorOffset
      caretPos[1] += sel.extentOffset
    }
  }
  if (caretPos[0] <= caretPos[1]) {return caretPos}
  return [caretPos[1], caretPos[0]]
}

export function setCaretPosition(el, position) {
  const range = document.createRange()
  const selection = window.getSelection()
  range.setStart(el, position)
  range.collapse(true)
  selection.removeAllRanges()
  selection.addRange(range)
}
