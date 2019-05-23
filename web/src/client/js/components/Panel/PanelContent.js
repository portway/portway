import React from 'react'
import PropTypes from 'prop-types'

const PanelContent = ({ children }) => {
  return (
    <div className="panel__content">
      {children}
    </div>
  )
}

PanelContent.propTypes = {
  children: PropTypes.node
}

export default PanelContent
