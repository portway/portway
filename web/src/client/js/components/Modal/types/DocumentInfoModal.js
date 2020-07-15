import React from 'react'
import PropTypes from 'prop-types'

const DocumentInfoModal = ({ documentId }) => {
  return (
    <div>
      Hey {documentId}
    </div>
  )
}

DocumentInfoModal.propTypes = {
  documentId: PropTypes.number.isRequired,
}

export default DocumentInfoModal
