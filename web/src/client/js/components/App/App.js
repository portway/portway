import { useEffect } from 'react'
import PropTypes from 'prop-types'
import { debounce } from 'Shared/utilities'

import 'CSS/app.scss'

const App = ({ children, history, routeChange }) => {
  useEffect(() => {
    const appElement = document.getElementById('application')

    // Set the application div to the height of the device or window
    const resizeHander = debounce(400, () => {
      appElement.style.height = window.innerHeight + 'px'
    })

    window.addEventListener('orientationchange', resizeHander, false)
    window.addEventListener('resize', resizeHander, false)

    history.listen((location, action) => {
      routeChange()
    })

    // Call it on load
    resizeHander()

    return function cleanup() {
      window.removeEventListener('orientationchange', resizeHander, false)
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
