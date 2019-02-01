import React from 'react'
import { render } from 'react-dom'
import SampleComponent from '../components/SampleComponent'

render(<SampleComponent />, document.getElementById('index'))

if (module.hot) {
  module.hot.accept()
}
