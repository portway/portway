import React, { useState, useRef, useCallback } from 'react'
import PropTypes from 'prop-types'

import useClickOutside from 'Hooks/useClickOutside'
import useBlur from 'Hooks/useBlur'
import useKeyboardShortcut from 'Hooks/useKeyboardShortcut'

import './Dropdown.scss'

const DropdownComponent = ({ align, button, children, className, menu, shortcut }) => {
  // Menu is not collapsed by default
  const [expanded, setExpanded] = useState(menu && menu.isOpen || false)
  const hasIcon = button.icon !== undefined
  // Custom hooks
  const nodeRef = useRef()
  const collapseCallback = useCallback(() => {
    setExpanded(false)
  }, [])
  const toggleCallback = useCallback(() => {
    setExpanded(e => !e)
  }, [])
  useClickOutside(nodeRef, collapseCallback)
  useBlur(nodeRef, collapseCallback)
  useKeyboardShortcut(shortcut, toggleCallback)
  return (
    <div ref={nodeRef} className={`dropdown ${className ? className : ''}`}>
      <button
        className={`btn ${button.className ? button.className : ''} ${
          hasIcon ? ' btn--with-icon' : ''
        }`}
        type="button"
        aria-haspopup
        aria-expanded={expanded}
        aria-label={button.label}
        onClick={() => { setExpanded(!expanded)}}>
        {hasIcon && <span className={`icon ${button.icon}`} />}
        {button.label && button.label}
      </button>
      <div className={`menu menu--${align}`} hidden={!expanded}>
        <ul className="menu__list">
          {children}
        </ul>
      </div>
    </div>
  )
}

DropdownComponent.propTypes = {
  align: PropTypes.string,
  button: PropTypes.shape({
    className: PropTypes.string,
    icon: PropTypes.string,
    label: PropTypes.string
  }),
  children: PropTypes.node.isRequired,
  className: PropTypes.string,
  menu: PropTypes.shape({
    isOpen: PropTypes.bool
  }),
  shortcut: PropTypes.string
}

DropdownComponent.defaultProps = {
  align: 'left',
  button: {
    className: '',
  },
  className: ''
}

export default DropdownComponent
