import React from 'react'
import PropTypes from 'prop-types'
import { withRouter } from 'react-router-dom'
import { connect } from 'react-redux'

import { uiConfirm } from 'Actions/ui'
import { updateDocument, deleteDocument } from 'Actions/document'
import useDataService from 'Hooks/useDataService'
import currentResource from 'Libs/currentResource'

import DocumentComponent from './DocumentComponent'

const DocumentContainer = ({
  deleteDocument,
  history,
  loading,
  location,
  match,
  ui,
  updateDocument,
  uiConfirm
}) => {
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
  if (typeof match.params.documentId === 'undefined') {
    return <div>No document</div>
  }

  /**
   * Otherwise we render the document, and update its values onChange
   */
  function nameChangeHandler(e) {
    if (e.target.value !== document.name) {
      updateDocument(document.projectId, document.id, {
        name: e.target.value,
        projectId: document.projectId
      })
    }
  }
  function removeDocumentHandler() {
    const message = (
      <span>
        {' '}
        Delete the document <span className="highlight">{document.name}</span> and all of its
        fields?
      </span>
    )
    const confirmedLabel = `Yes, delete this document`
    const confirmedAction = () => {
      deleteDocument(document.projectId, document.id, history)
    }
    uiConfirm({ message, confirmedAction, confirmedLabel })
  }
  return (
    <DocumentComponent
      document={document}
      nameChangeHandler={nameChangeHandler}
      removeDocumentHandler={removeDocumentHandler}
    />
  )
}

DocumentContainer.propTypes = {
  deleteDocument: PropTypes.func.isRequired,
  history: PropTypes.object.isRequired,
  location: PropTypes.object.isRequired,
  loading: PropTypes.object.isRequired,
  match: PropTypes.object.isRequired,
  ui: PropTypes.object.isRequired,
  updateDocument: PropTypes.func.isRequired,
  uiConfirm: PropTypes.func.isRequired
}

const mapStateToProps = (state) => {
  return {
    ui: state.ui,
    loading: state.documents.loading
  }
}

const mapDispatchToProps = {
  deleteDocument,
  updateDocument,
  uiConfirm
}

export default withRouter(
  connect(
    mapStateToProps,
    mapDispatchToProps
  )(DocumentContainer)
)
