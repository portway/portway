import React, { useRef } from 'react'
import PropTypes from 'prop-types'

import Constants from 'Shared/constants'
import { debounce } from 'Shared/utilities'
import { AddIcon, MoreIcon } from 'Components/Icons'
import DropdownComponent from 'Components/Dropdown/DropdownComponent'
import DocumentFieldsContainer from './DocumentFieldsContainer'

import './Document.scss'

const DocumentComponent = ({ document, fields, fieldAddModeHandler, fieldAddMode, fieldCreateHandler, nameChangeHandler, removeDocumentHandler }) => {
  const titleRef = useRef()
  const docKey = document ? document.id : 0
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
        <DropdownComponent
          align="right"
          button={dropdownButton}
          className="document__document-dropdown">
          <li>
            <button
              className="menu__item btn btn--white btn--danger" onClick={removeDocumentHandler}>
              Delete document...
            </button>
          </li>
        </DropdownComponent>
      </header>
      <DocumentFieldsContainer documentId={document.id} fields={fields} />
      <footer className="document__footer">
        <button className="btn btn--blank btn--with-circular-icon"
          aria-label="Add a field"
          aria-haspopup
          aria-expanded={fieldAddMode}
          title="Add a field"
          onClick={fieldAddModeHandler}>
          <div>
            <AddIcon width="18" height="18" />
          </div>
        </button>
        {fieldAddMode &&
        <div className="document__field-menu">
          <ul>
            <li><button className="btn btn--blank" onClick={() => { fieldCreateHandler(Constants.FIELD_TYPES.TEXT) }}>Text area</button></li>
            <li><button className="btn btn--blank"onClick={() => { fieldCreateHandler(Constants.FIELD_TYPES.STRING) }}>Text field</button></li>
            <li><button className="btn btn--blank" onClick={() => { fieldCreateHandler(Constants.FIELD_TYPES.NUMBER) }}>Number</button></li>
          </ul>
        </div>
        }
      </footer>
    </div>
  )
}

// @todo fill out this document object and add defaults
DocumentComponent.propTypes = {
  document: PropTypes.object,
  fields: PropTypes.object.isRequired,
  fieldAddMode: PropTypes.bool.isRequired,
  fieldAddModeHandler: PropTypes.func.isRequired,
  fieldCreateHandler: PropTypes.func.isRequired,
  nameChangeHandler: PropTypes.func.isRequired,
  removeDocumentHandler: PropTypes.func.isRequired
}

DocumentComponent.defaultProps = {
  document: {
    name: ''
  },
  fields: {}
}

export default DocumentComponent
