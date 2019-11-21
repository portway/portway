import React, { useCallback, useRef, useState } from 'react'
import PropTypes from 'prop-types'

import useClickOutside from 'Hooks/useClickOutside'
import { AddIcon } from 'Components/Icons'
import './ContentMenu.scss'

const ContentMenuComponent = ({ createFieldHandler, fields }) => {
  const [expanded, setExpanded] = useState(false)
  const menuRef = useRef()
  const contentRef = useRef()
  const collapseCallback = useCallback(() => {
    contentRef.current.scrollTop = 0
    setExpanded(false)
  }, [])
  useClickOutside(menuRef, collapseCallback)

  function renderFields(fieldGroup) {
    return fields[fieldGroup].map((field) => {
      function clickHandler() {
        setExpanded(false)
        contentRef.current.scrollTop = 0
        createFieldHandler(field.key)
      }
      return (
        <li className="content-menu__list-item" key={`item-${field.label}`}>
          <button className="btn btn--blank btn--with-icon content-menu__item-button" onClick={() => { clickHandler() }}>
            {field.icon}
            <span className="label">{field.label}</span>
          </button>
        </li>
      )
    })
  }

  function renderFieldGroups() {
    const fieldGroups = []
    Object.keys(fields).forEach((fieldGroup) => {
      fieldGroups.push(
        <div className="content-menu__group" key={`group-${fieldGroup}`}>
          <span className="content-menu__group-name">{fieldGroup}</span>
          <ul className="content-menu__list" key={fieldGroup}>
            {renderFields(fieldGroup)}
          </ul>
        </div>
      )
    })
    return fieldGroups
  }

  return (
    <div className="content-menu" ref={menuRef}>
      <button
        className="btn btn--blank btn--with-circular-icon content-menu__button"
        aria-haspopup
        aria-expanded={expanded}
        aria-label="Add a field"
        onClick={() => { setExpanded(!expanded) }}
        title="Add a custom field to your document">
        <AddIcon fill="#666666" width="24" height="24" />
      </button>
      <div className="content-menu__content" hidden={!expanded} ref={contentRef}>
        {renderFieldGroups()}
      </div>
    </div>
  )
}

ContentMenuComponent.propTypes = {
  createFieldHandler: PropTypes.func.isRequired,
  fields: PropTypes.object.isRequired
}

export default ContentMenuComponent
