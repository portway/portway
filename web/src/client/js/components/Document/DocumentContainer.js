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

const defaultDocument = {
  name: ''
}

const DocumentContainer = ({
  createMode,
  documentMode,
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

  console.log('render document container')

  let currentDocument = document

  /**
   * If we're creating a document, render nothing
   */
  if (createMode || match.params.documentId === PATH_DOCUMENT_NEW_PARAM) {
    return null
  }

  // if we don't have a documentId (null or undefined),
  // we shouldn't be loading this component
  if (match.params.documentId == null) {
    return null
  }

  //if the document id isn't a valid number, redirect to 404
  if (isNaN(match.params.documentId)) {
    return <NoDocument />
  }

  //if we're done loading things but the data never arrives, assume 404
  if (documentLoading === false && !currentDocument) {
    return <NoDocument />
  }

  // If the project doesn't exist
  if (projectLoading === false && !project) {
    return <NoDocument />
  }

  //things are still loading, return null
  if (!project) return null

  // The current document doesn't match the url params, usually because
  // the user has switched docs and the new doc hasn't loaded from currentResource helper.
  // In that case, we want to render a blank document
  if (currentDocument && currentDocument.id !== Number(match.params.documentId)) {
    currentDocument = defaultDocument
  }

  // If there's no current doc, we still want to render the doc
  // layout so the UI doesn't jump around
  if (!currentDocument) {
    currentDocument = defaultDocument
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
        <title>{project.name}: {currentDocument.name} –– {PRODUCT_NAME}</title>
      </Helmet>

      <DocumentComponent
        document={currentDocument}
        documentMode={documentMode}
        isFullScreen={isFullScreen}
        nameChangeHandler={nameChangeHandler}
        toggleDocumentMode={toggleDocumentMode}
        toggleFullScreenHandler={toggleFullScreenHandler} />
    </>
  )
}

DocumentContainer.propTypes = {
  createMode: PropTypes.bool.isRequired,
  documentMode: PropTypes.string,
  fields: PropTypes.object,
  isFullScreen: PropTypes.bool.isRequired,
  location: PropTypes.object.isRequired,
  match: PropTypes.object.isRequired,
  uiToggleDocumentMode: PropTypes.func.isRequired,
  uiToggleFullScreen: PropTypes.func.isRequired,
  updateDocument: PropTypes.func.isRequired,
}

const mapStateToProps = (state) => {
  return {
    createMode: state.ui.documents.createMode,
    documentMode: state.ui.document.documentMode,
    fields: state.documentFields[state.documents.currentDocumentId],
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
