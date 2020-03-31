import { commands } from 'codemirror'

// This is from the SimpleMDE plugin
// https://github.com/sparksuite/simplemde-markdown-editor/blob/master/src/js/codemirror/tablist.js
commands.tabAndIndentMarkdownList = function(cm) {
  const ranges = cm.listSelections()
  const pos = ranges[0].head
  const eolState = cm.getStateAfter(pos.line)
  const inList = eolState.list !== false

  if (inList) {
    cm.execCommand('indentMore')
    return
  }

  if (cm.options.indentWithTabs) {
    cm.execCommand('insertTab')
  } else {
    const spaces = Array(cm.options.tabSize + 1).join(' ')
    cm.replaceSelection(spaces)
  }
}

commands.shiftTabAndUnindentMarkdownList = function(cm) {
  const ranges = cm.listSelections()
  const pos = ranges[0].head
  const eolState = cm.getStateAfter(pos.line)
  const inList = eolState.list !== false

  if (inList) {
    cm.execCommand('indentLess')
    return
  }

  if (cm.options.indentWithTabs) {
    cm.execCommand('insertTab')
  } else {
    const spaces = Array(cm.options.tabSize + 1).join(' ')
    cm.replaceSelection(spaces)
  }
}
