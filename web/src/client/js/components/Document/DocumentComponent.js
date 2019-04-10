import React, { useRef } from 'react'
import PropTypes from 'prop-types'

import { AddIcon } from 'Components/Icons'

import './Document.scss'

const DocumentComponent = ({ document, nameChangeHandler }) => {
  const titleRef = useRef()
  const docKey = document ? document.id : 0
  return (
    <div className="document" key={docKey}>
      <header>
        <textarea
          className="document__title"
          onKeyDown={(e) => {
            if (e.key.toLowerCase() === 'enter') {
              nameChangeHandler(e)
              titleRef.current.blur()
            }
          }}
          defaultValue={document.name}
          ref={titleRef} />
      </header>
      {document &&
      <button className="field-button" aria-label="Add a field" title="Add a field">
        <div>
          <AddIcon fill="#ffffff" />
        </div>
      </button>
      }
      {/* <!-- Loop for fields here --> */}
    </div>
  )
}

// @todo fill out this document object and add defaults
DocumentComponent.propTypes = {
  document: PropTypes.object,
  nameChangeHandler: PropTypes.func.isRequired
}

export default DocumentComponent
