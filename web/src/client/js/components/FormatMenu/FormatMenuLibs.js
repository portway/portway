/**
 * These functions are taken and edited from EasyMDE, as they are the useful bits for
 * adding/toggling formatting of the text of CodeMirror
 *
 * We are not using EasyMDE, as the base CodeMirror in Markdown mode is quite enough. EasyMDE
 * caused too many bugs
 *
 * https://github.com/Ionaru/easy-markdown-editor
 * Copyright (c) 2015 Sparksuite, Inc.
 * Copyright (c) 2017 Jeroen Akkerman.
 */

export const blockStyles = {
  'bold': '**',
  'code': '```',
  'italic': '*',
}

/**
 * Returns the state of CodeMirror at a given position
 *
 * @param   {[type]}  cm   [cm description]
 * @param   {[type]}  pos  [pos description]
 *
 * @return  {[type]}       [return description]
 */
export function getState(cm, pos) {
  pos = pos || cm.getCursor('start')
  const stat = cm.getTokenAt(pos)
  if (!stat.type) return {}

  const types = stat.type.split(' ')
  const ret = {}

  let data; let text
  for (let i = 0; i < types.length; i++) {
    data = types[i]
    if (data === 'strong') {
      ret.bold = true
    } else if (data === 'variable-2') {
      text = cm.getLine(pos.line)
      if (/^\s*\d+\.\s/.test(text)) {
        ret['ordered-list'] = true
      } else {
        ret['unordered-list'] = true
      }
    } else if (data === 'atom') {
      ret.quote = true
    } else if (data === 'em') {
      ret.italic = true
    } else if (data === 'quote') {
      ret.quote = true
    } else if (data === 'strikethrough') {
      ret.strikethrough = true
    } else if (data === 'comment') {
      ret.code = true
    } else if (data === 'link') {
      ret.link = true
    } else if (data === 'tag') {
      ret.image = true
    } else if (data.match(/^header(-[1-6])?$/)) {
      ret[data.replace('header', 'heading')] = true
    }
  }
  return ret
}


export function replaceSelection(cm, active, startEnd, url) {
  let text
  let start = startEnd[0]
  let end = startEnd[1]
  const startPoint = {}

  const endPoint = {}
  Object.assign(startPoint, cm.getCursor('start'))
  Object.assign(endPoint, cm.getCursor('end'))
  if (url) {
    start = start.replace('#url#', url) // url is in start for upload-image
    end = end.replace('#url#', url)
  }
  if (active) {
    text = cm.getLine(startPoint.line)
    start = text.slice(0, startPoint.ch)
    end = text.slice(startPoint.ch)
    cm.replaceRange(start + end, {
      line: startPoint.line,
      ch: 0,
    })
  } else {
    text = cm.getSelection()
    cm.replaceSelection(start + text + end)

    startPoint.ch += start.length
    if (startPoint !== endPoint) {
      endPoint.ch += start.length
    }
  }
  cm.setSelection(startPoint, endPoint)
  cm.focus()
}

/**
 * Toggles block level elements
 *
 * @param   {[type]}  editor      [editor description]
 * @param   {[type]}  type        [type description]
 * @param   {[type]}  startChars  [startChars description]
 * @param   {[type]}  endChars    [endChars description]
 *
 * @return  {[type]}              [return description]
 */
export function toggleBlock(editor, type, startChars, endChars) {
  endChars = (typeof endChars === 'undefined') ? startChars : endChars
  const cm = editor
  const stat = getState(cm)

  let text
  let start = startChars
  let end = endChars

  const startPoint = cm.getCursor('start')
  const endPoint = cm.getCursor('end')

  if (stat[type]) {
    text = cm.getLine(startPoint.line)
    start = text.slice(0, startPoint.ch)
    end = text.slice(startPoint.ch)
    if (type === 'bold') {
      start = start.replace(/(\*\*|__)(?![\s\S]*(\*\*|__))/, '')
      end = end.replace(/(\*\*|__)/, '')
    } else if (type === 'italic') {
      start = start.replace(/(\*|_)(?![\s\S]*(\*|_))/, '')
      end = end.replace(/(\*|_)/, '')
    } else if (type === 'strikethrough') {
      start = start.replace(/(\*\*|~~)(?![\s\S]*(\*\*|~~))/, '')
      end = end.replace(/(\*\*|~~)/, '')
    }
    cm.replaceRange(start + end, {
      line: startPoint.line,
      ch: 0,
    }, {
      line: startPoint.line,
      ch: 99999999999999,
    })

    if (type === 'bold' || type === 'strikethrough') {
      startPoint.ch -= 2
      if (startPoint !== endPoint) {
        endPoint.ch -= 2
      }
    } else if (type === 'italic') {
      startPoint.ch -= 1
      if (startPoint !== endPoint) {
        endPoint.ch -= 1
      }
    }
  } else {
    text = cm.getSelection()
    if (type === 'bold') {
      text = text.split('**').join('')
      text = text.split('__').join('')
    } else if (type === 'italic') {
      text = text.split('*').join('')
      text = text.split('_').join('')
    } else if (type === 'strikethrough') {
      text = text.split('~~').join('')
    }
    cm.replaceSelection(start + text + end)

    startPoint.ch += startChars.length
    endPoint.ch = startPoint.ch + text.length
  }

  cm.setSelection(startPoint, endPoint)
  cm.focus()
}

export function toggleLine(cm, name) {
  if (/editor-preview-active/.test(cm.getWrapperElement().lastChild.className)) {return}

  const listRegexp = /^(\s*)(\*|-|\+|\d*\.)(\s+)/
  const whitespacesRegexp = /^\s*/

  const stat = getState(cm)
  const startPoint = cm.getCursor('start')
  const endPoint = cm.getCursor('end')
  const repl = {
    'quote': /^(\s*)>\s+/,
    'unordered-list': listRegexp,
    'ordered-list': listRegexp,
  }

  const _getChar = function(name, i) {
    const map = {
      'quote': '>',
      'unordered-list': '*',
      'ordered-list': '%%i.',
    }

    return map[name].replace('%%i', i)
  }

  const _checkChar = function(name, char) {
    const map = {
      'quote': '>',
      'unordered-list': '*',
      'ordered-list': '\\d+.',
    }
    const rt = new RegExp(map[name])

    return char && rt.test(char)
  }

  const _toggle = function(name, text, untoggleOnly) {
    const arr = listRegexp.exec(text)
    let char = _getChar(name, line)
    if (arr !== null) {
      if (_checkChar(name, arr[2])) {
        char = ''
      }
      text = arr[1] + char + arr[3] + text.replace(whitespacesRegexp, '').replace(repl[name], '$1')
    } else if (untoggleOnly === false) {
      text = char + ' ' + text
    }
    return text
  }

  let line = 1
  for (let i = startPoint.line; i <= endPoint.line; i++) {
    // eslint-disable-next-line no-loop-func
    (function(i) {
      let text = cm.getLine(i)
      if (stat[name]) {
        text = text.replace(repl[name], '$1')
      } else {
        // If we're toggling unordered-list formatting, check if the current line
        // is part of an ordered-list, and if so, untoggle that first.
        // Workaround for https://github.com/Ionaru/easy-markdown-editor/issues/92
        if (name === 'unordered-list') {
          text = _toggle('ordered-list', text, true)
        }
        text = _toggle(name, text, false)
        line += 1
      }
      cm.replaceRange(text, {
        line: i,
        ch: 0,
      }, {
        line: i,
        ch: 99999999999999,
      })
    })(i)
  }
  cm.focus()
}

export function toggleHeading(cm, size) {
  const startPoint = cm.getCursor('start')
  const endPoint = cm.getCursor('end')
  for (let i = startPoint.line; i <= endPoint.line; i++) {
    // eslint-disable-next-line no-loop-func
    (function(i) {
      let text = cm.getLine(i)
      const currHeadingLevel = text.search(/[^#]/)

      if (size === 1) {
        if (currHeadingLevel <= 0) {
          text = '# ' + text
        } else if (currHeadingLevel === size) {
          text = text.substr(currHeadingLevel + 1)
        } else {
          text = '# ' + text.substr(currHeadingLevel + 1)
        }
      } else if (size === 2) {
        if (currHeadingLevel <= 0) {
          text = '## ' + text
        } else if (currHeadingLevel === size) {
          text = text.substr(currHeadingLevel + 1)
        } else {
          text = '## ' + text.substr(currHeadingLevel + 1)
        }
      } else {
        if (currHeadingLevel <= 0) {
          text = '### ' + text
        } else if (currHeadingLevel === size) {
          text = text.substr(currHeadingLevel + 1)
        } else {
          text = '### ' + text.substr(currHeadingLevel + 1)
        }
      }

      cm.replaceRange(text, {
        line: i,
        ch: 0,
      }, {
        line: i,
        ch: 99999999999999,
      })
    })(i)
  }
  cm.focus()
}

/**
 * Action for drawing a link.
 */
export function drawLink(editor) {
  const cm = editor.codemirror
  const stat = getState(cm)
  const options = editor.options
  let url = 'https://'
  if (options.promptURLs) {
    url = prompt(options.promptTexts.link, 'https://')
    if (!url) {
      return false
    }
  }
  replaceSelection(cm, stat.link, options.insertTexts.link, url)
}

/**
 * Action for drawing a horizontal rule.
 */
export function drawHorizontalRule(editor) {
  const cm = editor.codemirror
  const stat = getState(cm)
  const options = editor.options
  replaceSelection(cm, stat.image, options.insertTexts.horizontalRule)
}
