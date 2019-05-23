import React from 'react'
import PropTypes from 'prop-types'

const PanelNavigation = ({ children }) => {
  function renderChildren() {
    return children.map((child, index) => {
      return <li key={`pn-${index}`} className="panel__navigation-item">{child}</li>
    })
  }

  return (
    <nav className="panel__navigation">
      <ul className="list--blank">
        {renderChildren()}
      </ul>
    </nav>
  )
}

PanelNavigation.propTypes = {
  children: PropTypes.node
}

export default PanelNavigation
