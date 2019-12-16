import React from 'react'
import PropTypes from 'prop-types'
import { withRouter } from 'react-router-dom'
import { connect } from 'react-redux'
import { Helmet } from 'react-helmet'

import { uiToggleDocumentMode, uiToggleFullScreen } from 'Actions/ui'
import { updateDocument } from 'Actions/document'
import useDataService from 'Hooks/useDataService'
import currentResource from 'Libs/currentResource'

import { DOCUMENT_MODE, PRODUCT_NAME, PATH_DOCUMENT_NEW_PARAM } from 'Shared/constants'
import DocumentComponent from './DocumentComponent'
import NoDocument from './NoDocument'

const DocumentContainer = ({
  documentMode,
  isCreating,
  isFullScreen,
  location,
  match,
  uiToggleDocumentMode,
  uiToggleFullScreen,
  updateDocument,
}) => {
  const { data: project, loading: projectLoading } = useDataService(currentResource('project', location.pathname), [
    location.pathname
  ])
  const { data: document, loading: documentLoading } = useDataService(currentResource('document', location.pathname), [
    location.pathname
  ])

  /**
   * If we're creating a document, render nothing
   */
  if (isCreating || match.params.documentId === PATH_DOCUMENT_NEW_PARAM) {
    return null
  }

  // if we don't have a documentId, we shouldn't be loading this component
  if (match.params.documentId === null) {
    return null
  }

  //if the document id isn't a valid number, redirect to 404
  if (!isCreating && match.params.documentId && isNaN(match.params.documentId)) {
    return <NoDocument />
  }

  //if we're done loading things but the data never arrives, assume 404
  if (!isCreating && documentLoading === false && !document) {
    return <NoDocument />
  }

  if (projectLoading === false && !project) {
    return <NoDocument />
  }

  //things are still loading, return null
  if (!project || !document) return null

  /**
   * If there is no document and we are not creating: true, then we render
   * a helpful message
   */

  if (!isCreating && typeof match.params.documentId === 'undefined' || match.params.documentId === PATH_DOCUMENT_NEW_PARAM) {
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

  function toggleFullScreenHandler(e) {
    uiToggleFullScreen(!isFullScreen)
  }

  function toggleDocumentMode(e) {
    const mode = documentMode === DOCUMENT_MODE.NORMAL ? DOCUMENT_MODE.EDIT : DOCUMENT_MODE.NORMAL
    uiToggleDocumentMode(mode)
  }

  return (
    <>
      <Helmet>
        <title>{project.name}: {document.name} –– {PRODUCT_NAME}</title>
      </Helmet>

      <DocumentComponent
        document={document}
        documentMode={documentMode}
        isFullScreen={isFullScreen}
        nameChangeHandler={nameChangeHandler}
        toggleDocumentMode={toggleDocumentMode}
        toggleFullScreenHandler={toggleFullScreenHandler} />
    </>
  )
}

DocumentContainer.propTypes = {
  documentMode: PropTypes.string,
  fields: PropTypes.object,
  isCreating: PropTypes.bool.isRequired,
  isFullScreen: PropTypes.bool.isRequired,
  location: PropTypes.object.isRequired,
  match: PropTypes.object.isRequired,
  uiToggleDocumentMode: PropTypes.func.isRequired,
  uiToggleFullScreen: PropTypes.func.isRequired,
  updateDocument: PropTypes.func.isRequired,
}

const mapStateToProps = (state) => {
  return {
    documentMode: state.ui.document.documentMode,
    fields: state.documentFields[state.documents.currentDocumentId],
    isCreating: state.ui.documents.creating,
    isFullScreen: state.ui.document.isFullScreen
  }
}

const mapDispatchToProps = {
  updateDocument,
  uiToggleDocumentMode,
  uiToggleFullScreen,
}

export default withRouter(
  connect(mapStateToProps, mapDispatchToProps)(DocumentContainer)
)
