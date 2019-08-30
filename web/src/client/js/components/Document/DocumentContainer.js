import React from 'react'
import PropTypes from 'prop-types'
import { withRouter } from 'react-router-dom'
import { connect } from 'react-redux'
import { Helmet } from 'react-helmet'

import { uiConfirm, uiToggleFullScreen } from 'Actions/ui'
import { deleteDocument, publishDocument, updateDocument } from 'Actions/document'
import useDataService from 'Hooks/useDataService'
import currentResource from 'Libs/currentResource'
import Constants from 'Shared/constants'

import { PRODUCT_NAME, PATH_DOCUMENT_NEW_PARAM } from 'Shared/constants'
import DocumentComponent from './DocumentComponent'

const DocumentContainer = ({
  deleteDocument,
  documents,
  history,
  isFullScreen,
  location,
  match,
  publishDocument,
  uiConfirm,
  uiToggleFullScreen,
  updateDocument,
}) => {
  const { data: project } = useDataService(currentResource('project', location.pathname), [
    location.pathname
  ])
  const { data: document } = useDataService(currentResource('document', location.pathname), [
    location.pathname
  ])

  if (!project || !document) return null

  /**
   * If we're creating a document, render nothing
   */
  if (documents.creating || match.params.documentId === Constants.PATH_DOCUMENT_NEW_PARAM) {
    return null
  }

  /**
   * If there is no document and we are not creating: true, then we render
   * a helpful message
   */

  if (typeof match.params.documentId === 'undefined' || match.params.documentId === PATH_DOCUMENT_NEW_PARAM) {
    return <div>No document</div>
  }

  /**
   * Otherwise we render the document, and update its values onChange
   */
  function nameChangeHandler(e) {
    if (e.target.value !== document.name) {
      updateDocument(document.projectId, document.id, {
        name: e.target.value
      })
    }
  }
  function publishDocumentHandler() {
    publishDocument(document.id)
  }
  function removeDocumentHandler() {
    const message = (
      <span> Delete the document <span className="highlight">{document.name}</span> and all of its fields?</span>
    )
    const confirmedLabel = `Yes, delete this document`
    const confirmedAction = () => { deleteDocument(document.projectId, document.id, history) }
    uiConfirm({ message, confirmedAction, confirmedLabel })
  }
  function toggleFullScreenHandler(e) {
    uiToggleFullScreen(!isFullScreen)
  }

  return (
    <>
      <Helmet>
        <title>{project.name}: {document.name} –– {PRODUCT_NAME}</title>
      </Helmet>

      <DocumentComponent
        document={document}
        isFullScreen={isFullScreen}
        isPublishing={documents.isPublishing}
        nameChangeHandler={nameChangeHandler}
        publishDocumentHandler={publishDocumentHandler}
        removeDocumentHandler={removeDocumentHandler}
        toggleFullScreenHandler={toggleFullScreenHandler} />
    </>
  )
}

DocumentContainer.propTypes = {
  deleteDocument: PropTypes.func.isRequired,
  documents: PropTypes.object.isRequired,
  fields: PropTypes.object,
  history: PropTypes.object.isRequired,
  isFullScreen: PropTypes.bool.isRequired,
  location: PropTypes.object.isRequired,
  match: PropTypes.object.isRequired,
  publishDocument: PropTypes.func.isRequired,
  uiConfirm: PropTypes.func.isRequired,
  uiToggleFullScreen: PropTypes.func.isRequired,
  updateDocument: PropTypes.func.isRequired,
}

const mapStateToProps = (state) => {
  return {
    fields: state.documentFields[state.documents.currentDocumentId],
    documents: state.ui.documents,
    isFullScreen: state.ui.document.isFullScreen
  }
}

const mapDispatchToProps = {
  deleteDocument,
  publishDocument,
  updateDocument,
  uiConfirm,
  uiToggleFullScreen
}

export default withRouter(
  connect(mapStateToProps, mapDispatchToProps)(DocumentContainer)
)
