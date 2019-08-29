import React, { useRef } from 'react'
import PropTypes from 'prop-types'

import { debounce } from 'Shared/utilities'
import { ExpandIcon, MoreIcon, PublishIcon } from 'Components/Icons'
import ValidationContainer from 'Components/Validation/ValidationContainer'
import { DropdownComponent, DropdownItem } from 'Components/Dropdown/Dropdown'
import SpinnerComponent from 'Components/Spinner/SpinnerComponent'
import DocumentFieldsContainer from 'Components/DocumentFields/DocumentFieldsContainer'

import './_Document.scss'

const DocumentComponent = ({
  document,
  isPublishing,
  nameChangeHandler,
  publishDocumentHandler,
  removeDocumentHandler,
  toggleFullScreenHandler,
}) => {
  const titleRef = useRef()
  const docKey = document ? document.id : 0
  const dropdownButton = {
    className: 'btn btn--blank btn--with-circular-icon',
    icon: <MoreIcon />
  }
  const changeHandlerAction = debounce(500, (e) => {
    nameChangeHandler(e)
  })
  return (
    <div className="document" key={docKey}>
      <ValidationContainer resource="document" value="name" />
      <header className="document__header">
        <button
          className="btn btn--blank document__button-expand"
          onClick={toggleFullScreenHandler}
          title="Expand to full screen">
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
  isPublishing: PropTypes.bool.isRequired,
  nameChangeHandler: PropTypes.func.isRequired,
  publishDocumentHandler: PropTypes.func.isRequired,
  removeDocumentHandler: PropTypes.func.isRequired,
  toggleFullScreenHandler: PropTypes.func.isRequired,
}

DocumentComponent.defaultProps = {
  document: {
    name: ''
  },
}

export default DocumentComponent
