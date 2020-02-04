import { useEffect } from 'react'
import PropTypes from 'prop-types'

import 'CSS/app.scss'

// https://github.com/Bernardo-Castilho/dragdroptouch
if ('ontouchstart' in document.documentElement) {
  import('Utilities/DragDropTouch')
}

const App = ({ children, history, routeChange }) => {
  useEffect(() => {
    const appElement = document.getElementById('application')
    function resizeHander() {
      appElement.style.height = window.innerHeight + 'px'
    }
    resizeHander()
    window.addEventListener('resize', resizeHander, false)
    history.listen((location, action) => {
      routeChange()
    })
    return function cleanup() {
      window.removeEventListener('resize', resizeHander, false)
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return children
}

App.propTypes = {
  children: PropTypes.node.isRequired,
  history: PropTypes.object.isRequired,
  routeChange: PropTypes.func.isRequired
}

export default App
