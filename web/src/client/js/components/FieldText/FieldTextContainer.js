import React from 'react'
import PropTypes from 'prop-types'

const FieldTextContainer = ({ documentId, fieldId }) => {
  return (
    <div className="field field--text">
      Field!
    </div>
  )
}

FieldTextContainer.propTypes = {
  documentId: PropTypes.string.isRequired,
  fieldId: PropTypes.string.isRequired
}

export default FieldTextContainer
