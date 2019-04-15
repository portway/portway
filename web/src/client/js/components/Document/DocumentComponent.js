import React, { useRef } from 'react'
import PropTypes from 'prop-types'

import { debounce } from 'Shared/utilities'
import { MoreIcon } from 'Components/Icons'
import DropdownComponent from 'Components/Dropdown/DropdownComponent'
import DocumentFieldsContainer from './DocumentFieldsContainer'

import './Document.scss'

const DocumentComponent = ({ document, nameChangeHandler, removeDocumentHandler }) => {
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
      <DocumentFieldsContainer />
    </div>
  )
}

// @todo fill out this document object and add defaults
DocumentComponent.propTypes = {
  document: PropTypes.object,
  nameChangeHandler: PropTypes.func.isRequired,
  removeDocumentHandler: PropTypes.func.isRequired
}

DocumentComponent.defaultProps = {
  document: {
    name: ''
  },
}

export default DocumentComponent
