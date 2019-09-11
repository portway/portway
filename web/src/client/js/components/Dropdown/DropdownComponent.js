/* eslint-disable jsx-a11y/no-static-element-interactions */
import React, { useState, useRef, useCallback } from 'react'
import PropTypes from 'prop-types'

import useClickOutside from 'Hooks/useClickOutside'
import useBlur from 'Hooks/useBlur'
import useKeyboardShortcut from 'Hooks/useKeyboardShortcut'

import './Dropdown.scss'

const DropdownComponent = ({ align, autoCollapse = true, button, children, className, disabled = false, open = false, shortcut }) => {
  const [expanded, setExpanded] = useState(open)
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

  let buttonStyle
  if (button.backgroundImage) {
    buttonStyle = `background-image: url('${button.backgroundImage}');`
  }

  return (
    <div ref={nodeRef} className={`dropdown${className ? ' ' + className : ''}`}>
      <button
        className={`btn${button.className ? ' ' + button.className : ''}`}
        disabled={disabled}
        type="button"
        aria-haspopup
        aria-expanded={expanded}
        aria-label={button.label}
        name={button.name}
        style={buttonStyle}
        onClick={() => { setExpanded(!expanded)}}>
        {button.iconPlacement === 'before' || button.iconPlacement === undefined && button.icon}
        {button.label && <div className="label">{button.label}</div>}
        {button.iconPlacement === 'after' && button.icon}
      </button>
      <div
        className={`menu menu--${align}`}
        hidden={!expanded}
        onKeyDown={() => { if (autoCollapse) { collapseCallback() } }}
        onClick={() => { if (autoCollapse) { collapseCallback() } }}>
        <ul className="menu__list">
          {children}
        </ul>
      </div>
    </div>
  )
}

DropdownComponent.propTypes = {
  align: PropTypes.string,
  autoCollapse: PropTypes.bool,
  button: PropTypes.shape({
    backgroundImage: PropTypes.string,
    className: PropTypes.string,
    icon: PropTypes.element,
    iconPlacement: PropTypes.string,
    label: PropTypes.string,
    name: PropTypes.string
  }),
  children: PropTypes.node.isRequired,
  className: PropTypes.string,
  disabled: PropTypes.bool,
  open: PropTypes.bool,
  shortcut: PropTypes.string
}

DropdownComponent.defaultProps = {
  align: 'left',
  button: {
    backgroundImage: null,
    iconPlacement: 'before',
  }
}

export default DropdownComponent
