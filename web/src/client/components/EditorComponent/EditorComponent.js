import React from 'react'
import { throttle } from '../../../shared/utilities'
import { focusElement, processFormatting, processBlock } from './helpers'

// Good list of markdown RegEx's
// https://gist.github.com/jbroadway/2836900

import './EditorComponent.scss'

class EditorComponent extends React.Component {
  constructor(props) {
    super(props)
    this.editorRef = React.createRef()
  }

  componentDidMount() {
    // Get a div in there for the first item
    this.insertInitialItem('p', this.editorRef.current)
    // Set up content editor
    document.execCommand('defaultParagraphSeparator', false, 'p')
  }

  insertInitialItem(nodeType, parentNode) {
    const ne = document.createElement(nodeType)
    ne.textContent = ' '
    parentNode.appendChild(ne)
    focusElement(ne, true)
  }

  render() {
    return (
      <div
        contentEditable
        className="editor-input"
        ref={this.editorRef}
        onKeyDown={this.keydownHandler.bind(this)}
        onKeyUp={throttle(this.keyupHandler.bind(this))}
      />
    )
  }

  keyupHandler(e) {
    // Process the node's textContent
    processFormatting('i', 'italic', /(\*|_)(.*?)\1\s/gm)
    processFormatting('b', 'bold', /(\*\*|__)(.*?)\1\s/gm)
    processFormatting('del', 'strikeThrough', /\~\~(.*?)\~\~\s/gm)

    // Process blocks
    processBlock('h1', /^#\s/)
    processBlock('h2', /^##\s/)
    processBlock('h3', /^###\s/)
    processBlock('h4', /^####\s/)
    processBlock('h5', /^#####\s/)
    processBlock('h6', /^######\s/)
  }

  keydownHandler(e) {
    const selection = window.getSelection()
    switch (e.keyCode) {
      case 13: // enter
        // Todo: Firefox isn't blinking?
        break
      case 8: // delete
        // We've made it to an empty field and want
        // a paragraph in there
        if (this.editorRef.current.children.length === 1) {
          if (selection.anchorNode.nodeType === 1) {
            e.preventDefault()
          }
        }
        break
    }
  }
}

export default EditorComponent
