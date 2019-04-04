import React from 'react'
import PropTypes from 'prop-types'

import EditorComponent from 'Components/Editor/EditorComponent'

const DocumentComponent = ({ document, nameChangeHandler }) => {
  return (
    <div className="document">
      <EditorComponent />
    </div>
  )
}

// @todo fill out this document object and add defaults
DocumentComponent.propTypes = {
  document: PropTypes.object.isRequired,
  nameChangeHandler: PropTypes.func.isRequired
}

export default DocumentComponent
