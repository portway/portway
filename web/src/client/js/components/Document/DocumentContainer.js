import React from 'react'
import PropTypes from 'prop-types'
import { withRouter } from 'react-router-dom'
import { connect } from 'react-redux'

import Store from '../../reducers'
import { updateDocument } from 'Actions/document'
import useDataService from 'Hooks/useDataService'
import currentResource from 'Libs/currentResource'

import { debounce } from 'Shared/utilities'
import DocumentComponent from './DocumentComponent'

const DocumentContainer = ({ location, ui }) => {
  const { data: document } = useDataService(currentResource('document', location.pathname), [
    location.pathname
  ])

  function createDocumentHandler() {

  }

  if (ui.documents.creating) {
    return <DocumentComponent
      nameChangeHandler={createDocumentHandler}
      document={null} />
  }

  if (!document) {
    return <div>No document</div>
  }

  const nameChangeAction = debounce(1000, (e) => {
    Store.dispatch(updateDocument(document.id, document.projectId, {
      name: e.target.value,
      projectId: document.projectId
    }))
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
  location: PropTypes.object.isRequired,
  ui: PropTypes.object.isRequired
}

const mapStateToProps = (state) => {
  return {
    ui: state.ui
  }
}

export default withRouter(
  connect(mapStateToProps)(DocumentContainer)
)
