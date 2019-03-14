import React, { useState, useRef, useCallback } from 'react'
import Select from 'react-select'
import PropTypes from 'prop-types'

import Constants from 'Shared/constants'
import useClickOutside from 'Hooks/useClickOutside'
import useBlur from 'Hooks/useBlur'
import DropdownListComponent from './DropdownListComponent'

import './_react-select.scss'

const DropdownComponent = ({ button, menu }) => {
  // Menu is not collapsed by default
  const [expanded, setExpanded] = useState(false)
  const hasIcon = button.icon !== undefined
  const selectRef = useRef()
  // Custom hooks
  const nodeRef = useRef()
  const collapseCallback = useCallback(() => {
    setExpanded(false)
  }, [])
  useClickOutside(nodeRef, collapseCallback)
  useBlur(nodeRef, collapseCallback)
  // When a menu item is selected
  const changeHandler = () => {
    if (menu.collapseOnChange) {
      collapseCallback()
    }
    menu.onChange
  }
  return (
    <div ref={nodeRef}>
      <button
        className={`btn ${button.className ? button.className : ''} ${
          hasIcon ? ' btn--with-icon' : ''
        }`}
        type="button"
        aria-haspopup
        aria-expanded={expanded}
        aria-label={button.label}
        onClick={() => {
          setExpanded(true)
          if (menu.hasAutoComplete) selectRef.current.focus()
        }}>
        {hasIcon && <span className={`icon ${button.icon}`} />}
        {button.label} {menu.value && menu.value.length > 0 ? ` (${menu.value.length})` : ''}
      </button>
      <div className={`menu ${menu.hasAutoComplete ? 'menu--with-select' : ''}`} hidden={!expanded}>
        {!menu.hasAutoComplete &&
        <DropdownListComponent
          basePath={Constants.PATH_PROJECT}
          options={menu.options}
          onChange={changeHandler} />
        }
        {menu.hasAutoComplete &&
        <Select
          ref={selectRef}
          className={`react-select-container`}
          classNamePrefix="react-select"
          defaultValue={menu && menu.value ? menu.value : null}
          isMulti={menu.multiSelect}
          menuIsOpen={menu.isOpen}
          onChange={changeHandler}
          options={menu.options}
          tabSelectsValue={false}
        />
        }
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
  menu: PropTypes.shape({
    collapseOnChange: PropTypes.bool,
    isOpen: PropTypes.bool,
    hasAutoComplete: PropTypes.bool,
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
  })
}

export default DropdownComponent
