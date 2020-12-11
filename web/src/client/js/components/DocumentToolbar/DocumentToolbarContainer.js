import React from 'react'
import PropTypes from 'prop-types'
import { useLocation, useParams, withRouter } from 'react-router-dom'
import { connect } from 'react-redux'

import * as strings from 'Loc/strings'
import { PATH_DOCUMENT_NEW_PARAM, URL_API_DOCS } from 'Shared/constants'

import { deleteDocument, publishDocument, unpublishDocument } from 'Actions/document'
import { uiConfirm } from 'Actions/ui'
import useDataService from 'Hooks/useDataService'
import currentResource from 'Libs/currentResource'

import DocumentToolbarComponent from './DocumentToolbarComponent'

const DocumentToolbarContainer = ({
  deleteDocument,
  documentMode,
  history,
  isCreating,
  isPublishing,
  publishDocument,
  uiConfirm,
  unpublishDocument
}) => {
  const { documentId, projectId } = useParams()
  const location = useLocation()
  const { data: document } = useDataService(currentResource('document', location.pathname), [
    location.pathname
  ])

  if (!documentId || !document) return null

  if (isCreating && documentId === PATH_DOCUMENT_NEW_PARAM) {
    return null
  }

  function publishDocumentHandler() {
    const message = (
      <>
        <p><b>{strings.PUBLISH_CONFIRMATION_TITLE} “{document.name}”?</b></p>
        <p>Publishing these changes will make them live in the <a href={URL_API_DOCS} target="_blank" rel="noopener noreferrer">API</a>.</p>
      </>
    )
    const options = {
      confirmedLabel: strings.PUBLISH_CONFIRMATION_LABEL,
      confirmedAction: () => { publishDocument(document.id, projectId) }
    }
    uiConfirm({ message, options })
  }

  function removeDocumentHandler() {
    const message = (
      <span>{strings.DELETE_CONFIRMATION_TITLE_PREFIX} <span className="highlight">{document.name}</span> {strings.DELETE_CONFIRMATION_TITLE_SUFFIX}</span>
    )
    const options = {
      confirmedLabel: strings.DELETE_CONFIRMATION_LABEL,
      confirmedAction: () => { deleteDocument(projectId, document.id, history) },
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
      confirmedAction: () => { unpublishDocument(document.id, projectId) },
      theme: 'danger'
    }
    uiConfirm({ message, options })
  }

  return (
    <DocumentToolbarComponent
      document={document}
      documentMode={documentMode}
      isCreating={isCreating}
      isPublishing={isPublishing}
      publishDocumentHandler={publishDocumentHandler}
      removeDocumentHandler={removeDocumentHandler}
      unpublishDocumentHandler={unpublishDocumentHandler}
    />
  )
}

DocumentToolbarContainer.propTypes = {
  deleteDocument: PropTypes.func.isRequired,
  documentMode: PropTypes.string.isRequired,
  history: PropTypes.object.isRequired,
  isCreating: PropTypes.bool,
  isPublishing: PropTypes.bool,
  publishDocument: PropTypes.func.isRequired,
  uiConfirm: PropTypes.func.isRequired,
  unpublishDocument: PropTypes.func.isRequired,
}

const mapStateToProps = (state) => {
  return {
    documentMode: state.ui.document.documentMode,
    isCreating: state.ui.documents.creating,
    isPublishing: state.ui.documents.isPublishing,
  }
}

const mapDispatchToProps = { deleteDocument, publishDocument, uiConfirm, unpublishDocument }

export default withRouter(
  connect(mapStateToProps, mapDispatchToProps)(DocumentToolbarContainer)
)
