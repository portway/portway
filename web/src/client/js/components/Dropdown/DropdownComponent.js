import React, { useState, useRef, useEffect, useCallback } from 'react'
import PropTypes from 'prop-types'

import useClickOutside from 'Hooks/useClickOutside'
import useBlur from 'Hooks/useBlur'
import useKeyboardShortcut from 'Hooks/useKeyboardShortcut'

import './Dropdown.scss'

const DropdownComponent = ({ button, children, className, menu, shortcut }) => {
  // Menu is not collapsed by default
  const [expanded, setExpanded] = useState(menu && menu.isOpen || false)
  const hasIcon = button.icon !== undefined
  // Set position of menu depending on where it is on the screen
  const [position, setPosition] = useState('left')
  const buttonRef = useRef()
  useEffect(() => {
    if (buttonRef.current) {
      setTimeout(() => {
        const leftPos = buttonRef.current.getBoundingClientRect().x
        if (leftPos) {
          (leftPos > window.innerWidth / 2) ? setPosition('right') : setPosition('left')
        }
      }, 20)
    }
  }, [])
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
    <div ref={nodeRef} className={`dropdown ${className}`}>
      <button
        className={`btn ${button.className ? button.className : ''} ${
          hasIcon ? ' btn--with-icon' : ''
        }`}
        type="button"
        aria-haspopup
        aria-expanded={expanded}
        aria-label={button.label}
        onClick={() => { setExpanded(!expanded)}}
        ref={buttonRef}>
        {hasIcon && <span className={`icon ${button.icon}`} />}
        {button.label}
      </button>
      <div className={`menu menu--${position}`} hidden={!expanded}>
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
  children: PropTypes.node.isRequired,
  className: PropTypes.string,
  menu: PropTypes.shape({
    isOpen: PropTypes.bool
  }),
  shortcut: PropTypes.string
}

export default DropdownComponent
