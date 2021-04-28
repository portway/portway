import React from 'react'
import PropTypes from 'prop-types'
import { useLocation, useParams, withRouter } from 'react-router-dom'
import { connect } from 'react-redux'

import * as strings from 'Loc/strings'
import { PATH_DOCUMENT_NEW_PARAM, URL_API_DOCS } from 'Shared/constants'

import { publishDocument } from 'Actions/document'
import { uiConfirm } from 'Actions/ui'
import useDataService from 'Hooks/useDataService'
import currentResource from 'Libs/currentResource'

import DocumentToolbarComponent from './DocumentToolbarComponent'

const DocumentToolbarContainer = ({
  isCreating,
  isPublishing,
  publishDocument,
  uiConfirm,
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

  return (
    <DocumentToolbarComponent
      document={document}
      isCreating={isCreating}
      isPublishing={isPublishing}
      publishDocumentHandler={publishDocumentHandler}
    />
  )
}

DocumentToolbarContainer.propTypes = {
  isCreating: PropTypes.bool,
  isPublishing: PropTypes.bool,
  publishDocument: PropTypes.func.isRequired,
  uiConfirm: PropTypes.func.isRequired,
}

const mapStateToProps = (state) => {
  return {
    isCreating: state.ui.documents.creating,
    isPublishing: state.ui.documents.isPublishing,
  }
}

const mapDispatchToProps = { publishDocument, uiConfirm }

export default withRouter(
  connect(mapStateToProps, mapDispatchToProps)(DocumentToolbarContainer)
)
