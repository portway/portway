import React from 'react'
import PropTypes from 'prop-types'
import { withRouter } from 'react-router-dom'
import { connect } from 'react-redux'

import { updateDocument, deleteDocument } from 'Actions/document'
import useDataService from 'Hooks/useDataService'
import currentResource from 'Libs/currentResource'

import DocumentComponent from './DocumentComponent'

const DocumentContainer = ({ deleteDocument, history, location, ui, updateDocument }) => {
  const { data: document } = useDataService(currentResource('document', location.pathname), [
    location.pathname
  ])

  /**
   * If we're creating a document, render nothing
   */
  if (ui.documents.creating) {
    return null
  }

  /**
   * If there is no document and we are not creating: true, then we render
   * a helpful message
   */
  if (!document) {
    return <div>No document</div>
  }

  /**
   * Otherwise we render the document, and update its values onChange
   */
  function nameChangeHandler(e) {
    if (e.target.textContent !== document.name) {
      updateDocument(document.projectId, document.id, {
        name: e.target.textContent,
        projectId: document.projectId
      })
    }
  }
  function removeDocumentHandler() {
    deleteDocument(document.projectId, document.id, history)
  }
  return <DocumentComponent
    nameChangeHandler={nameChangeHandler}
    removeDocumentHandler={removeDocumentHandler}
    document={document} />
}

DocumentContainer.propTypes = {
  deleteDocument: PropTypes.func.isRequired,
  history: PropTypes.object.isRequired,
  location: PropTypes.object.isRequired,
  ui: PropTypes.object.isRequired,
  updateDocument: PropTypes.func.isRequired
}

const mapStateToProps = (state) => {
  return {
    ui: state.ui
  }
}

const mapDispatchToProps = {
  deleteDocument,
  updateDocument
}

export default withRouter(
  connect(mapStateToProps, mapDispatchToProps)(DocumentContainer)
)
