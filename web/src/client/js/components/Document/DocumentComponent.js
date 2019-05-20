import React, { useRef } from 'react'
import PropTypes from 'prop-types'
import cx from 'classnames'

import Constants from 'Shared/constants'
import { debounce } from 'Shared/utilities'
import { AddIcon, ExpandIcon, MoreIcon, PublishIcon } from 'Components/Icons'
import ValidationContainer from 'Components/Validation/ValidationContainer'
import { DropdownComponent, DropdownItem, DropdownSubmenu } from 'Components/Dropdown/Dropdown'
import SpinnerComponent from 'Components/Spinner/SpinnerComponent'
import DocumentFieldsContainer from 'Components/DocumentFields/DocumentFieldsContainer'

import './Document.scss'

const DocumentComponent = ({
  document, fieldCreationHandler, nameChangeHandler, isPublishing,
  publishDocumentHandler, removeDocumentHandler }) => {
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
  const menuClasses = cx({
    'document__menus': true,
    'document__menus--disabled': isPublishing
  })
  return (
    <div className="document" key={docKey}>
      <ValidationContainer resource="document" value="name" />
      <header className="document__header">
        <button className="btn btn--blank document__button-expand" title="Expand to full screen">
          <ExpandIcon />
        </button>
        <div className="document__title-container">
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
          <span className="document__publish-date note">Last published: May 3 2019</span>
        </div>
        <button
          className="btn btn--small btn--with-icon"
          disabled={isPublishing}
          onClick={publishDocumentHandler}
          title="Publish this version">
          {isPublishing && <SpinnerComponent width="12" height="12" color="#ffffff" />}
          {!isPublishing && <PublishIcon fill="#ffffff" />}
          <span className="label">Publish</span>
        </button>
      </header>
      <div className={menuClasses}>
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
      </div>
      <DocumentFieldsContainer />
    </div>
  )
}

// @todo fill out this document object and add defaults
DocumentComponent.propTypes = {
  document: PropTypes.object,
  fieldCreationHandler: PropTypes.func.isRequired,
  nameChangeHandler: PropTypes.func.isRequired,
  isPublishing: PropTypes.bool.isRequired,
  publishDocumentHandler: PropTypes.func.isRequired,
  removeDocumentHandler: PropTypes.func.isRequired
}

DocumentComponent.defaultProps = {
  document: {
    name: ''
  },
}

export default DocumentComponent
