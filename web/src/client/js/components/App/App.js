import React, { useEffect, useState } from 'react'
import PropTypes from 'prop-types'
import { debounce } from 'Shared/utilities'

import { NETWORK_STATUS, NOTIFICATION_TYPES } from 'Shared/constants'
import ApplicationContext from '../../contexts/ApplicationContext'

import 'CSS/app.scss'

// https://github.com/Bernardo-Castilho/dragdroptouch
if ('ontouchstart' in document.documentElement) {
  import('Utilities/DragDropTouch')
}

const App = ({
  children,
  createNotification,
  history,
  routeChange,
}) => {
  // Keeping track of application level state through React context
  // Use this sparingly
  const initialAppState = {
    networkStatus: NETWORK_STATUS.ONLINE
  }
  const [appState, setAppState] = useState(initialAppState)

  useEffect(() => {
    const appElement = document.getElementById('application')

    // Set the application div to the height of the device or window
    const resizeHander = debounce(400, () => {
      appElement.style.height = window.innerHeight + 'px'
    })

    function updateOnlineStatus() {
      const status = navigator.onLine ? NETWORK_STATUS.ONLINE : NETWORK_STATUS.OFFLINE
      switch (status) {
        case NETWORK_STATUS.ONLINE: {
          document.body.classList.remove('body--network-offline')
          break
        }
        case NETWORK_STATUS.OFFLINE: {
          document.body.classList.add('body--network-offline')
          const message = 'Connection lost! Please check your internet connection.'
          createNotification(message, NOTIFICATION_TYPES.WARNING)
          break
        }
        default:
          break
      }
      // Do this locally for Context
      setAppState({ ...appState, networkStatus: status })
    }

    window.addEventListener('orientationchange', resizeHander, false)
    window.addEventListener('resize', resizeHander, false)
    window.addEventListener('offline', updateOnlineStatus)
    window.addEventListener('online', updateOnlineStatus)

    history.listen((location, action) => {
      routeChange()
    })

    // Call it on load
    resizeHander()
    updateOnlineStatus()

    return function cleanup() {
      window.removeEventListener('orientationchange', resizeHander, false)
      window.removeEventListener('resize', resizeHander, false)
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return (
    <ApplicationContext.Provider value={appState}>
      {children}
    </ApplicationContext.Provider>
  )
}

App.propTypes = {
  children: PropTypes.node.isRequired,
  createNotification: PropTypes.func.isRequired,
  history: PropTypes.object.isRequired,
  routeChange: PropTypes.func.isRequired,
}

export default App
