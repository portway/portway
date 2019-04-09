import React from 'react'
import PropTypes from 'prop-types'
import { withRouter } from 'react-router-dom'

import useDataService from 'Hooks/useDataService'
import currentResource from 'Libs/currentResource'

import { debounce } from 'Shared/utilities'
import DocumentComponent from './DocumentComponent'

const DocumentContainer = ({ location }) => {
  const { data: document } = useDataService(currentResource('document', location.pathname), [
    location.pathname
  ])
  if (!document) {
    return <div>No document</div>
  }

  const nameChangeAction = debounce(1000, (e) => {
    console.info(`Change my name in redux: ${e.target.value}`)
  })

  function nameChangeHandler(e) {
    e.persist()
    nameChangeAction(e)
  }

  return <DocumentComponent
    nameChangeHandler={nameChangeHandler}
    document={document} />
}

DocumentContainer.propTypes = {
  location: PropTypes.object.isRequired
}

export default withRouter(DocumentContainer)
