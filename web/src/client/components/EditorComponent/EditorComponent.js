import React from 'react'
import { throttle } from '../../../shared/utilities'

// Good list of markdown RegEx's
// https://gist.github.com/jbroadway/2836900

import './EditorComponent.scss'

class EditorComponent extends React.Component {
  constructor(props) {
    super(props)
    this.editorRef = React.createRef()
    this.state = {
      tree: []
    }
  }

  componentDidMount() {
    // Get a div in there for the first item
    const nd = document.createElement('div')
    nd.appendChild(document.createElement('br'))
    this.editorRef.current.appendChild(nd)
    nd.focus()
    // Set up content editor
    document.execCommand('insertHTML', false, 'div')
    // document.execCommand('styleWithCSS', true)
    document.addEventListener('keydown', this.keydownHandler.bind(this), false)
    document.addEventListener('keyup', throttle(this.keyupHandler.bind(this)), false)
  }

  render() {
    return (
      <div className="editor">
        <div className="editor-input" contentEditable ref={this.editorRef} />
      </div>
    )
  }

  keyupHandler(e) {
    const el = window.getSelection()

    if (el.focusNode) {
      // Don't process already processed elements
      if (el.focusNode.parentElement.tagName === 'EM') {
        return
      }

      // Process the node's textContent
      if (el.focusNode.nodeType === 3 && el.focusNode.textContent) {
        let patternMatch
        const emphasisPattern = /(\*|_)(.*?)\1\s/g
        while ((patternMatch = emphasisPattern.exec(el.focusNode.textContent)) != null) {
          if (el.focusNode.parentElement.tagName !== 'EM') {
            // Create the range to select
            const range = document.createRange()
            range.setStart(el.focusNode, patternMatch.index)
            // grab before the trailing whitespace
            range.setEnd(el.focusNode, emphasisPattern.lastIndex - 1)
            // Create the new selection
            el.removeAllRanges()
            el.addRange(range)
            // Format that selection
            // document.execCommand('insertHTML', false, `<em>${el.toString()}</em>`)
            document.execCommand('italic', false)
            el.collapseToEnd()
            // range.detach()
          }
        }
      }
    }

    // const range = document.createRange()
    // range.setStart(el.focusNode, patternMatch.index)
    // range.setEnd(el.focusNode, emphasisPattern.lastIndex)
    // // Make the selection and italicize it
    // el.addRange(range)
    // document.execCommand('italic', false)
    // el.collapseToEnd()

    // If the element should be a certain one but isn't
    if (el.anchorNode && el.anchorNode.nodeType === 3) {
      if (/^#\s/.test(el.anchorNode.textContent)) {
        document.execCommand('formatBlock', false, 'h1')
      }
      if (/^##\s/.test(el.anchorNode.textContent)) {
        document.execCommand('formatBlock', false, 'h2')
      }
      if (/^###\s/.test(el.anchorNode.textContent)) {
        document.execCommand('formatBlock', false, 'h3')
      }
      if (/^####\s/.test(el.anchorNode.textContent)) {
        document.execCommand('formatBlock', false, 'h4')
      }
      if (/^#####\s/.test(el.anchorNode.textContent)) {
        document.execCommand('formatBlock', false, 'h5')
      }
      if (/^######\s/.test(el.anchorNode.textContent)) {
        document.execCommand('formatBlock', false, 'h6')
      }
    }
  }

  keydownHandler(e) {
    switch (e.keyCode) {
      case 13: // enter
        document.execCommand('removeFormat', false)
        if (this.editorRef.current.firstChild.nodeType === 3) {
          const o = this.editorRef.current.firstChild
          const d = document.createElement('div')
          d.textContent = o.textContent
          this.editorRef.current.insertBefore(d, this.editorRef.current.firstChild)
          this.editorRef.current.removeChild(o)
        }
        this.setState({ tree: this.editorRef.current.children })
        return false
      case 8: // delete
        break
    }
  }
}

export default EditorComponent
