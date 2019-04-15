import React, { useRef } from 'react'
import PropTypes from 'prop-types'

import Constants from 'Shared/constants'
import { debounce } from 'Shared/utilities'
import { AddIcon, MoreIcon } from 'Components/Icons'
import DropdownComponent from 'Components/Dropdown/DropdownComponent'
import DocumentFieldsContainer from 'Components/DocumentFields/DocumentFieldsContainer'

import './Document.scss'

const DocumentComponent = ({ document, fieldCreationHandler, nameChangeHandler, removeDocumentHandler }) => {
  const titleRef = useRef()
  const docKey = document ? document.id : 0
  const fieldDropdownButton = {
    className: 'btn btn--blank btn--with-circular-icon',
    icon: <AddIcon width="18" height="18" />,
    label: 'Add field'
  }
  const dropdownButton = {
    className: 'btn btn--blank btn--with-circular-icon',
    icon: <MoreIcon width="18" height="18" />
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
        <DropdownComponent align="right" button={fieldDropdownButton} className="document__field-dropdown">
          <li><button onClick={() => { fieldCreationHandler(Constants.FIELD_TYPES.TEXT) }}>Text area</button></li>
          <li><button onClick={() => { fieldCreationHandler(Constants.FIELD_TYPES.STRING) }}>Text field</button></li>
          <li><button onClick={() => { fieldCreationHandler(Constants.FIELD_TYPES.NUMBER) }}>Number</button></li>
        </DropdownComponent>
        <DropdownComponent align="right" button={dropdownButton} className="document__document-dropdown">
          <li>
            <button>Duplicate document</button>
          </li>
          <li className="menu__divider">
            <button
              className="btn--danger" onClick={removeDocumentHandler}>
              Delete document...
            </button>
          </li>
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
