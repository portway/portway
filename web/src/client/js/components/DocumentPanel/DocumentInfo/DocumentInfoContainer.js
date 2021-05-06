import React from 'react'
import PropTypes from 'prop-types'
import { useHistory, useLocation, useParams } from 'react-router-dom'
import { connect } from 'react-redux'

import currentResource from 'Libs/currentResource'
import useDataService from 'Hooks/useDataService'

import * as strings from 'Loc/strings'
import { debounce } from 'Shared/utilities'
import { uiConfirm } from 'Actions/ui'
import { deleteDocument, unpublishDocument, updateDocument } from 'Actions/document'

import DocumentInfoComponent from './DocumentInfoComponent'

const DocumentInfoContainer = ({
  deleteDocument,
  isPublishing,
  uiConfirm,
  unpublishDocument,
  updateDocument,
}) => {
  const { projectId, documentId } = useParams()
  const location = useLocation()
  const routerHistory = useHistory()

  const { data: currentDocument } = useDataService(currentResource('document', location.pathname), [
    location.pathname
  ])

  if (!documentId || !currentDocument) return null

  const debouncedDocumentChangeHandler = debounce(1000, (body) => {
    updateDocument(projectId, documentId, body)
  })

  function removeDocumentHandler() {
    const message = (
      <span>{strings.DELETE_CONFIRMATION_TITLE_PREFIX} <span className="highlight">{currentDocument.name}</span> {strings.DELETE_CONFIRMATION_TITLE_SUFFIX}</span>
    )
    const options = {
      confirmedLabel: strings.DELETE_CONFIRMATION_LABEL,
      confirmedAction: () => { deleteDocument(projectId, documentId, routerHistory) },
      theme: 'danger'
    }
    uiConfirm({ message, options })
  }

  function unpublishDocumentHandler() {
    const message = (
      <>
        <p>{strings.UNPUBLISH_CONFIRMATION_TITLE} <span className="highlight">{document.name}</span>?</p>
        <p>{strings.UNPUBLISH_CONFIRMATION_DESCRIPTION}</p>
      </>
    )
    const options = {
      confirmedLabel: strings.UNPUBLISH_CONFIRMATION_LABEL,
      confirmedAction: () => { unpublishDocument(documentId, projectId) },
      theme: 'danger'
    }
    uiConfirm({ message, options })
  }

  return (
    <DocumentInfoComponent
      document={currentDocument}
      documentChangeHandler={debouncedDocumentChangeHandler}
      isPublishing={isPublishing}
      removeDocumentHandler={removeDocumentHandler}
      unpublishDocumentHandler={unpublishDocumentHandler}
    />
  )
}

DocumentInfoContainer.propTypes = {
  deleteDocument: PropTypes.func.isRequired,
  isPublishing: PropTypes.bool.isRequired,
  uiConfirm: PropTypes.func.isRequired,
  unpublishDocument: PropTypes.func.isRequired,
  updateDocument: PropTypes.func.isRequired,
}

const mapStateToProps = (state) => {
  return {
    isPublishing: state.ui.documents.isPublishing,
  }
}

const mapDisatchToProps = {
  deleteDocument,
  uiConfirm,
  unpublishDocument,
  updateDocument
}

export default connect(mapStateToProps, mapDisatchToProps)(DocumentInfoContainer)
