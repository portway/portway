import React, { useState, useRef, useCallback } from 'react'
import Select from 'react-select'
import PropTypes from 'prop-types'

import useClickOutside from 'Hooks/useClickOutside'
import useBlur from 'Hooks/useBlur'
import useKeyboardShortcut from 'Hooks/useKeyboardShortcut'

import './DropdownSelect.scss'

const DropdownSelectComponent = ({ button, className, menu, shortcut }) => {
  // Menu is not collapsed by default
  const [expanded, setExpanded] = useState(false)
  const hasIcon = button.icon !== undefined
  const selectRef = useRef()
  // Custom hooks
  const nodeRef = useRef()
  const collapseCallback = useCallback(() => {
    setExpanded(false)
  }, [])
  const toggleCallback = useCallback(() => {
    setExpanded(!expanded)
    if (!expanded) {
      selectRef.current.focus()
    }
  }, [expanded])
  useClickOutside(nodeRef, collapseCallback)
  useBlur(nodeRef, collapseCallback)
  useKeyboardShortcut(shortcut, toggleCallback)
  // When a menu item is selected
  const changeHandler = (value) => {
    if (menu.collapseOnChange) {
      collapseCallback()
    }
    menu.onChange(value)
  }
  return (
    <div ref={nodeRef} className={`dropdown dropdown--with-select ${className}`}>
      <button
        className={`btn ${button.className ? button.className : ''} ${
          hasIcon ? ' btn--with-icon' : ''
        }`}
        type="button"
        aria-haspopup
        aria-expanded={expanded}
        aria-label={button.label}
        onClick={toggleCallback}>
        {hasIcon && button.icon}
        {button.label && <span className="label">{button.label}</span>}
        {menu.value && menu.value.length > 0 ? ` (${menu.value.length})` : ''}
      </button>
      <div className={`menu menu--with-select`} hidden={!expanded}>
        <Select
          ref={selectRef}
          className={`react-select-button`}
          classNamePrefix="react-select"
          components={menu.customComponents}
          isMulti={menu.multiSelect}
          menuIsOpen={menu.isOpen}
          onChange={changeHandler}
          options={menu.options}
          placeholder="Filter..."
          tabSelectsValue={false} />
      </div>
    </div>
  )
}

DropdownSelectComponent.propTypes = {
  button: PropTypes.shape({
    className: PropTypes.string,
    icon: PropTypes.element,
    label: PropTypes.string.isRequired
  }),
  className: PropTypes.string,
  menu: PropTypes.shape({
    collapseOnChange: PropTypes.bool,
    customComponents: PropTypes.object,
    isOpen: PropTypes.bool,
    multiSelect: PropTypes.bool,
    onChange: PropTypes.func.isRequired,
    options: PropTypes.arrayOf(
      PropTypes.shape({
        value: PropTypes.string,
        label: PropTypes.string
      })
    ).isRequired,
    value: PropTypes.arrayOf(
      PropTypes.shape({
        value: PropTypes.string,
        label: PropTypes.string
      })
    )
  }),
  shortcut: PropTypes.string
}

export default DropdownSelectComponent
