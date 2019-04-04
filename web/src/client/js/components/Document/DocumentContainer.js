import React from 'react'
import PropTypes from 'prop-types'
import { withRouter } from 'react-router-dom'

import DocumentComponent from './DocumentComponent'

function nameChangeHandler(e) {
  console.info('Change my name in redux as a type', e.currentTarget.textContent)
}

const DocumentContainer = ({ location }) => {
  return <DocumentComponent
    nameChangeHandler={nameChangeHandler}
    document={document} />
}

DocumentContainer.propTypes = {
  location: PropTypes.object.isRequired
}

export default withRouter(DocumentContainer)
