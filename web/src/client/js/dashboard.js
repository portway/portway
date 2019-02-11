import React from 'react'
import { render } from 'react-dom'
import EditorComponentContainer from '../components/EditorComponent'

render(<EditorComponentContainer />, document.getElementById('editor'))

// Todo: Investigate why the globals.js doesnt work for this one
if (process.env.NODE_ENV !== 'production' && module.hot) {
  module.hot.accept()
}
