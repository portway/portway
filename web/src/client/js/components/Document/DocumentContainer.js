import React from 'react'
import PropTypes from 'prop-types'

import DocumentComponent from './DocumentComponent'

const DocumentContainer = ({ location }) => {
  return <DocumentComponent document={document} />
}

DocumentContainer.propTypes = {
  location: PropTypes.object.isRequired
}

export default DocumentContainer
