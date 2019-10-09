import { useEffect } from 'react'
import PropTypes from 'prop-types'

const App = ({ children, history, routeChange }) => {
  useEffect(() => {
    history.listen((location, action) => {
      routeChange()
    })
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
