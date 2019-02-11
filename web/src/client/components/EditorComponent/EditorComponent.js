import React from 'react'
import { debounce } from '../../../shared/utilities'

import './EditorComponent.scss'

class EditorComponent extends React.Component {
  constructor(props) {
    super(props)
    this.editorRef = React.createRef()
    this.state = {
      inputs: []
    }
  }

  componentDidMount() {
    const inputs = this.editorRef.current.querySelectorAll(
      '.editor-input'
    )
    this.setState({ inputs: inputs })
    inputs[inputs.length - 1].focus()
    document.execCommand('insertHTML', false, '')
    document.addEventListener(
      'keydown',
      this.keydownHandler.bind(this),
      false
    )
    document.addEventListener(
      'keyup',
      debounce(200, this.keyupHandler.bind(this)),
      false
    )
  }

  render() {
    return (
      <div className="editor" ref={this.editorRef}>
        <div className="editor-input" contentEditable />
      </div>
    )
  }

  keyupHandler(e) {
    const currentInput = e.target
    if (
      currentInput.textContent &&
      currentInput.textContent.match(/^#\s/)
    ) {
      currentInput.classList.add('h1')
    } else {
      currentInput.classList.remove('h1')
    }
  }

  keydownHandler(e) {
    switch (e.keyCode) {
      case 13: // enter
        e.preventDefault()
        document.execCommand('insertHTML', false, '')
        const newLine = document.createElement('div')
        newLine.setAttribute('contenteditable', '')
        newLine.classList.add('editor-input')
        this.editorRef.current.appendChild(newLine)
        newLine.innerHTML = ''
        newLine.focus()
        return false
      case 8: // delete
        let currentSelection = window.getSelection()
        const currentInput = currentSelection.anchorNode
        if (
          currentInput.textContent === '' ||
          currentInput.textContent === ' '
        ) {
          e.preventDefault()
          const previousLine = currentInput.previousElementSibling
          if (previousLine) {
            this.editorRef.current.removeChild(currentInput)
            previousLine.focus()
            // New range
            const range = document.createRange()
            range.selectNodeContents(previousLine)
            range.collapse(false)
            // Move the cursor
            currentSelection = window.getSelection()
            currentSelection.removeAllRanges()
            currentSelection.addRange(range)
          }
          return false
        }
        break
    }
  }
}

export default EditorComponent
