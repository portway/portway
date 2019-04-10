import React from 'react'
import PropTypes from 'prop-types'

import { AddIcon } from 'Components/Icons'
import EditorComponent from 'Components/Editor/EditorComponent'

import './Document.scss'

const DocumentComponent = ({ document, nameChangeHandler }) => {
  return (
    <div className="document" key={document.id}>
      <header>
        <input
          className="document__title"
          defaultValue={document.name}
          onChange={nameChangeHandler} />
      </header>
      <EditorComponent />
      <button className="field-button" aria-label="Add a field" title="Add a field">
        <div>
          <AddIcon fill="#ffffff" />
        </div>
      </button>
      {/* <!-- Loop for fields here --> */}
    </div>
  )
}

// @todo fill out this document object and add defaults
DocumentComponent.propTypes = {
  document: PropTypes.object.isRequired,
  nameChangeHandler: PropTypes.func.isRequired
}

export default DocumentComponent
