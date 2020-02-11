import { getCaretPosition, getElementAtPosition } from './cursor'

// Fastest way to get number of tabs
// @todo pull this into a utility function
// https://stackoverflow.com/questions/7420502/whats-the-best-fastest-way-to-find-the-number-of-tabs-to-start-a-string
function getNumberOfTabs(string) {
  let count = 0
  let index = 0
  while (string.charAt(index++) === '\t') {
    count++
  }
  return count
}

const ROOT_CLASS = 'portway-editor'
// Saved RegExp expressions
// https://regex101.com/r/GcrSLq/1
// https://regex101.com/r/GcrSLq/2/
// @todo Pull this out to a constants file since we'll probably be using it a few places
const REGEXP = {
  BOLD: /(\*\*|__)(.*?)\1/gim,
  CODE_BLOCK: /```[a-z]*\n[\s\S]*?\n```/g,
  OL: /^\t*([0-9])\.(.*)/gm,
  UL: /^\t*(\*)(.*)/gm
}

class Renderer {
  constructor(el) {
    this._classRules = {
      heading: /(#+)(.*)/g,
      ol: REGEXP.OL,
      ul: REGEXP.UL,
    }
    // To change markup of the text
    this._styleRules = [
      { regex: /(#+)(.*)/g, replacement: this._styleHeader }, // headers
      { regex: /!\[([^\[]+)\]\(([^\)]+)\)/g, replacement: '<img src=\'$2\' alt=\'$1\'>' }, // image
      { regex: /\[([^\[]+)\]\(([^\)]+)\)/g, replacement: this._styleLink }, // hyperlink
      { regex: REGEXP.BOLD, replacement: '<strong>**$2**</strong>' }, // bold
      { regex: /(\*|_)(.*?)\1/g, replacement: '<em>_$2_</em>' }, // emphasis
      { regex: /\~\~(.*?)\~\~/g, replacement: '<del>~~$1~~</del>' }, // del
      { regex: /\:\"(.*?)\"\:/g, replacement: '<q>$1</q>' }, // quote
      // { regex: /`(.*?)`/g, replacement: '<code>$1</code>' }, // inline code
      { regex: REGEXP.UL, replacement: this._styleUL }, // ul lists
      { regex: REGEXP.OL, replacement: this._styleOL }, // ol lists
      { regex: /\n(&gt;|\>)(.*)/g, replacement: this._styleBlockquote }, // blockquotes
      { regex: /\n-{5,}/g, replacement: '\n<hr />' }, // horizontal rule
      // { regex: /\n([^\n]+)\n/g, replacement: para }, // add paragraphs
      // { regex: /<\/ul>\s?<ul>/g, replacement: '' }, // fix extra ul
      // { regex: /<\/ol>\s?<ol>/g, replacement: '' }, // fix extra ol
      // { regex: /<\/blockquote><blockquote>/g, replacement: '\n' } // fix extra blockquote
    ]
    this._container = document.createElement('div')
    this._container.setAttribute('class', ROOT_CLASS)
    this._container.setAttribute('contenteditable', 'true')
    this._container.addEventListener('mouseup', this._lineNavigationHandler.bind(this), false)
    this._container.addEventListener('keyup', this._lineNavigationHandler.bind(this), false)
    this._container.addEventListener('keydown', this._keyDownHandler.bind(this), false)

    // Insert El right after the textarea
    el.insertAdjacentElement('afterend', this._container)
    el.style.display = 'none'

    // Keep track of the rendered lines
    this._currentLine = 0
    this._currentVisualLine = 0
    this._caretPosition = [0, 0]
    this._lines = el.value.split('\n')
    this._lineElements = []
    this._renderLines()
  }

  /**
   *
   */
  _keyDownHandler(e) {
    if (e.key.toLowerCase() === 'enter') {
      e.preventDefault()
      console.info('Insert a new line and focus it')
      // @todo Create an insertLine function that takes the line number, any text that may be after
      // the current selection/cursor, and a type if we are in a "block" like a ul or such
      return false
    }
  }


  /**
   * Formatting
   * ---------------------------------------------------------------------------
   * @todo put these into a different file. Formatters.js or something?
   */
  // Headers
  _classHeader(line, count) {
    return `${ROOT_CLASS}--line--heading ${ROOT_CLASS}--line--heading-h${count}`
  }
  _styleHeader(text, chars, content) {
    const level = chars.length
    return `<span class="${ROOT_CLASS}--format ${ROOT_CLASS}--format--h${level}">${chars}</span> ${content.trim()}`
  }
  // Lists
  _classUl() {
    return `${ROOT_CLASS}--line--unordered-list`
  }
  _classOl() {
    return `${ROOT_CLASS}--line--ordered-list`
  }
  _styleUL(line, dot, lineWithoutDot) {
    const indent = ('\t').repeat(getNumberOfTabs(line))
    return `<div>${indent}</div><div class="${ROOT_CLASS}--format ${ROOT_CLASS}--format--ul">${dot} </div><div>${lineWithoutDot.trim()}</div>`
  }
  _styleOL(line, number, lineWithoutNumber) {
    // console.log(arguments)
    const indent = ('\t').repeat(getNumberOfTabs(line))
    return `<div>${indent}</div><div class="${ROOT_CLASS}--format ${ROOT_CLASS}--format--ol">${number}.</div><div>${lineWithoutNumber.trim()}</div>`
  }
  // Links
  _styleLink(text, chars, content) {
    return `<span class="${ROOT_CLASS}--format ${ROOT_CLASS}--format--link">[<a href="${content}">${chars}</a>]</span><span class=\"${ROOT_CLASS}--format\">(${content})</span>`
  }


  /**
   * Lines
   * ---------------------------------------------------------------------------
   */

  /**
   * Saves the cursor and line number (wrapped lines) as you key around the
   * text document
   *
   * @param   {Event}  e  key or mouse event
   */
  _lineNavigationHandler(e) {
    this._caretPosition = getCaretPosition(this._container)
    this._currentLine = getElementAtPosition()
  }

  /**
   * Looks at the line, checking if it matches the RegExp, and returns
   * a classList to add to the line container element
   *
   * @param   {String}  line  [line description]
   * @return  {String}        string of class names for the line container
   */
  _getLineClass(line) {
    const headings = line.match(this._classRules.heading)
    if (headings) {
      const count = headings[0].split(' ')[0].length
      return this._classHeader(line, count)
    }
    const ol = line.match(this._classRules.ol)
    if (ol) {
      return this._classOl(line)
    }
    const ul = line.match(this._classRules.ul)
    if (ul) {
      return this._classUl(line)
    }
    return ''
  }

  /**
   * Loops through the styleRules array and applies the RegExp styling of
   * markup
   *
   * @param   {String}  line  a line from _lines
   * @return  {String}        a modified, styled line
   */
  _styleLine(line) {
    this._styleRules.forEach((rule) => {
      line = line.replace(rule.regex, rule.replacement)
    })
    return line
  }

  /**
   * Renders all of the lines from the textarea's value
   * If you'd like to render one line, that's not here
   */
  _renderLines() {
    // Loop through the lines in the textarea, creating a div for each
    for (let lineNum = 0; lineNum < this._lines.length; lineNum++) {
      const preppedLine = this._lines[lineNum].replace(/^\s+/gm, '\t') // replace leading spaces with tabs
      const line = this._styleLine(preppedLine)
      const cssClass = this._getLineClass(preppedLine)
      // Create the line
      const lineElement = document.createElement('div')
      lineElement.setAttribute('class', `${ROOT_CLASS}--line ${cssClass}`)
      lineElement.setAttribute('data-line', lineNum)
      lineElement.innerHTML = line
      this._lineElements.push(lineElement)
      this._container.appendChild(lineElement)
    }
  }
}

export default Renderer
