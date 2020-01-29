import React, { useEffect } from 'react'
import PropTypes from 'prop-types'

import './_PanelStyles.scss'

const Panel = ({ children }) => {
  useEffect(() => {
    document.querySelector('body').classList.add('body--with-panel')
    return function cleanup() {
      document.querySelector('body').classList.remove('body--with-panel')
    }
  }, [])
  return (
    <div className="panel">
      <div className="panel__container">
        { children }
      </div>
    </div>
  )
}

Panel.propTypes = {
  children: PropTypes.node
}

export default Panel
