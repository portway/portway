import React from 'react'
import PropTypes from 'prop-types'

const PanelNavigation = ({ children }) => {
  function renderChildren() {
    if (children.length) {
      return children.map((child, index) => {
        return <li key={`pn-${index}`} className="panel__navigation-item">{child}</li>
      })
    } else {
      console.info('PanelNavigation: If you have items wrapped in a HOC, make sure to wrap each item, not a group')
      return null
    }
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
