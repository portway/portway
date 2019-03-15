import React, { useState, useRef, useCallback } from 'react'
import PropTypes from 'prop-types'

import useClickOutside from 'Hooks/useClickOutside'
import useBlur from 'Hooks/useBlur'
import useKeyboardShortcut from 'Hooks/useKeyboardShortcut'

const DropdownComponent = ({ button, children, className, menu, shortcut }) => {
  // Menu is not collapsed by default
  const [expanded, setExpanded] = useState(menu.isOpen || false)
  const hasIcon = button.icon !== undefined
  const selectRef = useRef()
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
    <div ref={nodeRef} className={className}>
      <button
        className={`btn ${button.className ? button.className : ''} ${
          hasIcon ? ' btn--with-icon' : ''
        }`}
        type="button"
        aria-haspopup
        aria-expanded={expanded}
        aria-label={button.label}
        onClick={() => {
          setExpanded(!expanded)
          if (expanded) selectRef.current.focus()
        }}>
        {hasIcon && <span className={`icon ${button.icon}`} />}
        {button.label} {menu.value && menu.value.length > 0 ? ` (${menu.value.length})` : ''}
      </button>
      <div className="menu" hidden={!expanded}>
        <ul className="menu__list">
          {children}
        </ul>
      </div>
    </div>
  )
}

DropdownComponent.propTypes = {
  button: PropTypes.shape({
    className: PropTypes.string,
    icon: PropTypes.string,
    label: PropTypes.string.isRequired
  }),
  children: PropTypes.array.isRequired,
  className: PropTypes.string,
  menu: PropTypes.shape({
    isOpen: PropTypes.bool
  }),
  shortcut: PropTypes.string
}

export default DropdownComponent
