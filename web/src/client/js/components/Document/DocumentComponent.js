import React, { useEffect, useRef } from 'react'
import PropTypes from 'prop-types'

import { DOCUMENT_MODE } from 'Shared/constants'
import { debounce } from 'Shared/utilities'
import { ExpandIcon, SettingsIcon } from 'Components/Icons'
import ValidationContainer from 'Components/Validation/ValidationContainer'
import DocumentFieldsContainer from 'Components/DocumentFields/DocumentFieldsContainer'

import './_Document.scss'

const DocumentComponent = ({
  document,
  documentMode,
  isFullScreen,
  nameChangeHandler,
  toggleDocumentMode,
  toggleFullScreenHandler,
}) => {
  const titleRef = useRef()

  // If we've exited fullscreen, but the UI is still in fullscreen
  // This happens when hitting the escape key when in fullscreen
  useEffect(() => {
    function fullScreenChangeHandler(e) {
      const fullscreenElement = window.document.fullscreenElement || window.document.webkitCurrentFullScreenElement
      if (!fullscreenElement && isFullScreen) toggleFullScreenHandler()
      return
    }
    window.document.addEventListener('fullscreenchange', fullScreenChangeHandler, false)
    window.document.addEventListener('webkitfullscreenchange', fullScreenChangeHandler, false)
    return function cleanup() {
      window.document.removeEventListener('fullscreenchange', fullScreenChangeHandler, false)
      window.document.removeEventListener('webkitfullscreenchange', fullScreenChangeHandler, false)
    }
  })

  const docKey = document ? document.id : 0
  const changeHandlerAction = debounce(500, (e) => {
    nameChangeHandler(e)
  })
  return (
    <div className="document" key={docKey}>
      <ValidationContainer resource="document" value="name" />
      <header className="document__header">
        <button
          aria-label="Expand the editor to full screen"
          className="btn btn--blank btn--with-circular-icon document__button-expand"
          onClick={() => {
            // This has to be here because of Safari
            // You have to call fullscreen functions on the actual element onClick
            if (window.document.fullscreenElement || window.document.webkitFullscreenElement) {
              const exitFullscreen = window.document.exitFullscreen || window.document.webkitExitFullscreen
              exitFullscreen.call(window.document)
            } else {
              const documentEl = window.document.documentElement
              const requestFullscreen = documentEl.webkitRequestFullscreen || documentEl.requestFullscreen
              requestFullscreen.call(documentEl)
            }
            toggleFullScreenHandler()
          }}
          title="Expand to full screen">
          <ExpandIcon />
        </button>
        <div className="document__title-container">
          <input
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
        <div className="document__toggle-container">
          <button className="btn btn--blank" onClick={toggleDocumentMode} title="Re-order or remove fields">
            {documentMode === DOCUMENT_MODE.NORMAL &&
            <SettingsIcon />
            }
            {documentMode === DOCUMENT_MODE.EDIT &&
            <>Done</>
            }
          </button>
        </div>
      </header>
      <DocumentFieldsContainer />
    </div>
  )
}

// @todo fill out this document object and add defaults
DocumentComponent.propTypes = {
  document: PropTypes.object,
  documentMode: PropTypes.string,
  isFullScreen: PropTypes.bool.isRequired,
  nameChangeHandler: PropTypes.func.isRequired,
  toggleDocumentMode: PropTypes.func.isRequired,
  toggleFullScreenHandler: PropTypes.func.isRequired,
}

DocumentComponent.defaultProps = {
  document: {
    name: ''
  },
}

export default DocumentComponent
