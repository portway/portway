import React from 'react'
import PropTypes from 'prop-types'
import { withRouter } from 'react-router-dom'

import { debounce } from 'Shared/utilities'
import DocumentComponent from './DocumentComponent'

const nameChangeAction = debounce(1000, (e) => {
  console.info(`Change my name in redux: ${e.target.value}`)
})

const nameChangeHandler = (e) => {
  e.persist()
  nameChangeAction(e)
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
