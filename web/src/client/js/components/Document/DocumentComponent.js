import React, { useRef } from 'react'
import PropTypes from 'prop-types'

import Constants from 'Shared/constants'
import { debounce } from 'Shared/utilities'
import { AddIcon, MoreIcon } from 'Components/Icons'
import { DropdownComponent, DropdownItem, DropdownSubmenu } from 'Components/Dropdown/Dropdown'
import DocumentFieldsContainer from 'Components/DocumentFields/DocumentFieldsContainer'

import './Document.scss'

const DocumentComponent = ({ document, fieldCreationHandler, nameChangeHandler, removeDocumentHandler }) => {
  const titleRef = useRef()
  const docKey = document ? document.id : 0
  const contentDropdown = {
    className: 'btn btn--blank btn--with-circular-icon',
    icon: <AddIcon />,
    label: 'Insert'
  }
  const dataDropdown = {
    className: 'btn btn--blank btn--with-circular-icon',
    icon: <AddIcon />,
    label: 'Add data'
  }
  const dropdownButton = {
    className: 'btn btn--blank btn--with-circular-icon',
    icon: <MoreIcon />
  }
  const changeHandlerAction = debounce(500, (e) => {
    nameChangeHandler(e)
  })
  return (
    <div className="document" key={docKey}>
      <header className="document__header">
        <textarea
          className="document__title"
          defaultValue={document.name}
          onChange={(e) => {
            e.persist()
            changeHandlerAction(e)
          }}
          onKeyDown={(e) => {
            if (e.key.toLowerCase() === 'enter') {
              nameChangeHandler(e)
              titleRef.current.blur()
            }
          }}
          ref={titleRef} />
        <DropdownComponent align="right" button={contentDropdown} className="document__field-dropdown">
          <DropdownItem label="Text" type="button" onClick={() => { fieldCreationHandler(Constants.FIELD_TYPES.TEXT) }} />
        </DropdownComponent>
        <DropdownComponent align="right" button={dataDropdown} className="document__document-data-dropdown">
          <DropdownItem label="Text" type="submenu">
            <DropdownSubmenu align="right">
              <DropdownItem label="Textbox" type="button" onClick={() => { fieldCreationHandler(Constants.FIELD_TYPES.TEXT) }} />
              <DropdownItem label="String" type="button" onClick={() => { fieldCreationHandler(Constants.FIELD_TYPES.STRING) }} />
            </DropdownSubmenu>
          </DropdownItem>
          <DropdownItem label="Number" type="submenu">
            <DropdownSubmenu align="right">
              <DropdownItem label="Number" type="button" onClick={() => { fieldCreationHandler(Constants.FIELD_TYPES.NUMBER) }} />
            </DropdownSubmenu>
          </DropdownItem>
        </DropdownComponent>
        <DropdownComponent align="right" button={dropdownButton} className="document__document-dropdown">
          <DropdownItem label="Duplicate document" type="button" />
          <DropdownItem label="Delete document..." type="button" className="btn--danger" divider onClick={() => { removeDocumentHandler() }} />
        </DropdownComponent>
      </header>
      <DocumentFieldsContainer />
    </div>
  )
}

// @todo fill out this document object and add defaults
DocumentComponent.propTypes = {
  document: PropTypes.object,
  fieldCreationHandler: PropTypes.func.isRequired,
  nameChangeHandler: PropTypes.func.isRequired,
  removeDocumentHandler: PropTypes.func.isRequired
}

DocumentComponent.defaultProps = {
  document: {
    name: ''
  },
}

export default DocumentComponent
