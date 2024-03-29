import React, { useEffect, useRef } from 'react'
import PropTypes from 'prop-types'
import { useLocation, useParams } from 'react-router-dom'
import { connect } from 'react-redux'
import { Helmet } from 'react-helmet'

import { uiToggleFullScreen } from 'Actions/ui'
import { updateDocument } from 'Actions/document'
import { toggleDocumentPanel } from 'Actions/documentPanel'
import useDataService from 'Hooks/useDataService'
import currentResource from 'Libs/currentResource'
import { fetchDocument } from 'Actions/document'
import {
  receiveRemoteFieldChange,
  updateRemoteUserFieldFocus,
  updateDocumentRoomUsers
} from 'Actions/userSync'
import { documentSocket } from '../../sockets/SocketProvider'
import { currentUserId } from 'Libs/currentIds'

import { PRODUCT_NAME, PATH_DOCUMENT_NEW_PARAM } from 'Shared/constants'
import DocumentHeaderComponent from './DocumentHeaderComponent'
import NoDocument from './NoDocument'

const defaultDocument = {
  name: ''
}

const DocumentHeaderContainer = ({
  createMode,
  fetchDocument,
  isFullScreen,
  isDocumentPanelOpen,
  receiveRemoteFieldChange,
  toggleDocumentPanel,
  uiToggleFullScreen,
  updateDocument,
  updateDocumentRoomUsers,
  updateRemoteUserFieldFocus
}) => {
  const location = useLocation()
  const params = useParams()
  const currentDocumentIdRef = useRef()

  const { data: project, loading: projectLoading } = useDataService(currentResource('project', location.pathname), [
    location.pathname
  ])
  const { data: document, loading: documentLoading } = useDataService(currentResource('document', location.pathname), [
    location.pathname
  ])

  let currentDocument = document

  // need to reset on every render and track using a ref so that the handleUserFieldChange function has access
  // to the current id value
  currentDocumentIdRef.current = currentDocument && currentDocument.id

  // on mount, set up sync field change and focus change listeners
  useEffect(() => {
    const handleUserFieldChange = (userId, fieldId) => {
      receiveRemoteFieldChange(userId, fieldId)
      if (userId !== currentUserId.toString()) {
        fetchDocument(currentDocumentIdRef.current)
      }
    }

    const handleDocumentRoomUsersUpdate = (userIds) => {
      updateDocumentRoomUsers(currentDocumentIdRef.current, userIds)
    }

    documentSocket.on('userFieldChange', handleUserFieldChange)
    documentSocket.on('userFocusChange', updateRemoteUserFieldFocus)
    documentSocket.on('documentRoomUsersUpdated', handleDocumentRoomUsersUpdate)
    return () => {
      documentSocket.off('userFieldChange', handleUserFieldChange)
      documentSocket.off('userFocusChange', updateRemoteUserFieldFocus)
      documentSocket.off('documentRoomUsersUpdated', handleDocumentRoomUsersUpdate)
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])
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
    return null
  }

  // If the project doesn't exist
  if (projectLoading === false && !project) {
    return <NoDocument />
  }

  // vital things haven't started loading yet, return null
  if (documentLoading == null || projectLoading == null) {
    return null
  }

  // things are still loading, return null
  if (!project || (documentLoading && !currentDocument)) {
    return null
  }

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

  function toggleDocumentPanelHandler(e) {
    toggleDocumentPanel(!isDocumentPanelOpen)
  }

  return (
    <>
      <Helmet>
        <title>{project.name}: {currentDocument.name} –– {PRODUCT_NAME}</title>
      </Helmet>

      <DocumentHeaderComponent
        document={currentDocument}
        isFullScreen={isFullScreen}
        isDocumentPanelOpen={isDocumentPanelOpen}
        nameChangeHandler={nameChangeHandler}
        toggleDocumentPanel={toggleDocumentPanelHandler}
        toggleFullScreenHandler={toggleFullScreenHandler} />
    </>
  )
}

DocumentHeaderContainer.propTypes = {
  createMode: PropTypes.bool.isRequired,
  fetchDocument: PropTypes.func.isRequired,
  isFullScreen: PropTypes.bool.isRequired,
  isDocumentPanelOpen: PropTypes.bool.isRequired,
  receiveRemoteFieldChange: PropTypes.func.isRequired,
  toggleDocumentPanel: PropTypes.func.isRequired,
  uiToggleFullScreen: PropTypes.func.isRequired,
  updateDocument: PropTypes.func.isRequired,
  updateDocumentRoomUsers: PropTypes.func.isRequired,
  updateRemoteUserFieldFocus: PropTypes.func.isRequired,
}

const mapStateToProps = (state) => {
  return {
    createMode: state.ui.documents.createMode,
    fields: state.documentFields[state.documents.currentDocumentId],
    isFullScreen: state.ui.document.isFullScreen,
    isDocumentPanelOpen: state.documentPanel.panel.visible,
  }
}

const mapDispatchToProps = {
  fetchDocument,
  receiveRemoteFieldChange,
  toggleDocumentPanel,
  uiToggleFullScreen,
  updateDocument,
  updateDocumentRoomUsers,
  updateRemoteUserFieldFocus,
}

export default connect(mapStateToProps, mapDispatchToProps)(DocumentHeaderContainer)
