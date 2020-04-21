import React, { useEffect } from 'react'
import PropTypes from 'prop-types'
import { useLocation, useParams } from 'react-router-dom'
import { connect } from 'react-redux'
import { Helmet } from 'react-helmet'

import { uiToggleDocumentMode, uiToggleFullScreen } from 'Actions/ui'
import { updateDocument } from 'Actions/document'
import useDataService from 'Hooks/useDataService'
import currentResource from 'Libs/currentResource'
import { fetchDocument } from 'Actions/document'

import { DOCUMENT_MODE, PRODUCT_NAME, PATH_DOCUMENT_NEW_PARAM } from 'Shared/constants'
import DocumentComponent from './DocumentComponent'
import NoDocument from './NoDocument'
import useSyncUserFocus from 'Hooks/useSyncUserFocus'
import useSyncFieldChange from 'Hooks/useSyncFieldChange'
import documentSocket from '../../sockets/SocketProvider'

const defaultDocument = {
  name: ''
}

const DocumentContainer = ({
  createMode,
  documentMode,
  fetchDocument,
  isFullScreen,
  uiToggleDocumentMode,
  uiToggleFullScreen,
  updateDocument,
}) => {
  const location = useLocation()
  const params = useParams()

  const { data: project, loading: projectLoading } = useDataService(currentResource('project', location.pathname), [
    location.pathname
  ])
  const { data: document, loading: documentLoading } = useDataService(currentResource('document', location.pathname), [
    location.pathname
  ])

  let currentDocument = document

  const currentDocumentId = currentDocument && currentDocument.id
  // useSyncUserFocus(currentDocumentId)
  // useSyncFieldChange(currentDocumentId, fetchDocument)

  // on mount, set up sync field change and focus change listeners
  useEffect(() => {
    documentSocket.on('userFieldChange', handleUserFieldChange)
    return () => {
      documentSocket.off('userFieldChange', handleUserFieldChange)
    }
  }, [])

  useEffect(() => {
    console.log("mounting DocumentContainer")
    return () => {
      console.log("unmounting DocumentContainer")
    }
  })

  console.log({createMode, paramDocId: params.documentId, documentLoading, currentDocument, projectLoading, project })
  /**
   * If we're creating a document, render nothing
   */
  if (createMode || params.documentId === PATH_DOCUMENT_NEW_PARAM) {
    return null
  }

  // if we don't have a documentId (null or undefined),
  // we shouldn't be loading this component
  if (params.documentId == null) {
    return null
  }

  //if the document id isn't a valid number, redirect to 404
  if (isNaN(params.documentId)) {
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

  // vital things haven't started loading yet, return null
  if (documentLoading == null || projectLoading == null) return null

  // things are still loading, return null
  if (!project || documentLoading) return null

  // The current document doesn't match the url params, usually because
  // the user has switched docs and the new doc hasn't loaded from currentResource helper.
  // In that case, we want to render a blank document
  if (currentDocument && currentDocument.id !== Number(params.documentId)) {
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
  console.log('here')
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
  fetchDocument: PropTypes.func.isRequired,
  fields: PropTypes.object,
  isFullScreen: PropTypes.bool.isRequired,
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
  fetchDocument,
  updateDocument,
  uiToggleDocumentMode,
  uiToggleFullScreen,
}

export default connect(mapStateToProps, mapDispatchToProps)(DocumentContainer)
