import React from 'react'
import PropTypes from 'prop-types'

const PanelNavigation = ({ children }) => {
  function scrollContentHandler(e) {
    const content = document.querySelector('main')
    content.scrollTop = 0
  }

  function renderChildren() {
    return React.Children.map(children, (child, index) => {
      return (
        // eslint-disable-next-line jsx-a11y/no-noninteractive-element-interactions
        <li
          key={`pn-${index}`}
          className="panel__navigation-item"
          onClick={scrollContentHandler}
          onKeyDown={scrollContentHandler}
        >
          {child}
        </li>
      )
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
