import React from 'react'
import PropTypes from 'prop-types'
import { withRouter } from 'react-router-dom'

import DocumentComponent from './DocumentComponent'

const DocumentContainer = ({ location }) => {
  return <DocumentComponent document={document} />
}

DocumentContainer.propTypes = {
  location: PropTypes.object.isRequired
}

export default withRouter(DocumentContainer)
