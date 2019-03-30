import React from 'react'
import PropTypes from 'prop-types'

const DocumentComponent = ({ document }) => {
  return (
    <div className="document">
      <h1>I am a document</h1>
    </div>
  )
}

// @todo fill out this document object and add defaults
DocumentComponent.propTypes = {
  document: PropTypes.object.isRequired
}

export default DocumentComponent
