import React from 'react'
import PropTypes from 'prop-types'

import './_PanelStyles.scss'

const Panel = ({ children }) => {
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
