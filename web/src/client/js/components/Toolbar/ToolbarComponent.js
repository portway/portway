import React from 'react'
import PropTypes from 'prop-types'

import './Toolbar.scss'

const ToolbarComponent = ({ start, end }) => {
  return (
    <header className="toolbar">
      <div className="toolbar__start">
        {start}
      </div>
      <div className="toolbar__end">
        {end}
      </div>
    </header>
  )
}

ToolbarComponent.propTypes = {
  start: PropTypes.node,
  end: PropTypes.node,
}

export default ToolbarComponent
