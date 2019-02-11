import { debounce } from '../../shared/utilities'

const keydownHandler = function(e) {
  // .match(/^#\s/)
  // console.log(e.keyCode)
  switch (e.keyCode) {
    case 13: // enter
      e.preventDefault()
      document.execCommand('insertHTML', false, '')
      const newLine = document.createElement('div')
      newLine.setAttribute('contenteditable', '')
      newLine.classList.add('input')
      editor.appendChild(newLine)
      newLine.innerHTML = ''
      newLine.focus()
      console.info(newLine.children)
      return false
      break
    case 8: // delete
      let currentSelection = window.getSelection()
      const currentInput = currentSelection.anchorNode
      if (
        currentInput.textContent === '' ||
        currentInput.textContent === ' '
      ) {
        e.preventDefault()
        const previousLine = currentInput.previousElementSibling
        console.info(previousLine)
        editor.removeChild(currentInput)
        previousLine.focus()
        // New range
        const range = document.createRange()
        range.selectNodeContents(previousLine)
        range.collapse(false)
        // Move the cursor
        currentSelection = window.getSelection()
        currentSelection.removeAllRanges()
        currentSelection.addRange(range)
        return false
      }
      break
  }
}
const keyupHandler = function(e) {
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
const editor = document.querySelector('.editor')
const input = editor.querySelector('.input')
input.focus()
document.execCommand('insertHTML', false, ' ')
document.addEventListener('keyup', debounce(200, keyupHandler), false)
document.addEventListener('keydown', keydownHandler, false)
