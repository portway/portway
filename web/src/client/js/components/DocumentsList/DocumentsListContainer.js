import React from 'react'
import PropTypes from 'prop-types'
import { withRouter, Redirect } from 'react-router-dom'
import { connect } from 'react-redux'

import * as strings from 'Loc/strings'
import { PATH_DOCUMENT_NEW, PATH_DOCUMENT_NEW_PARAM, PATH_PROJECT, PATH_404 } from 'Shared/constants'
import useDataService from 'Hooks/useDataService'
import dataMapper from 'Libs/dataMapper'

import { createDocument, deleteDocument, unpublishDocument } from 'Actions/document'
import { copyField, moveField } from 'Actions/field'
import { uiConfirm, uiDocumentCreate } from 'Actions/ui'
import DocumentsListComponent from './DocumentsListComponent'
import NoProject from './NoProject'

const DocumentsListContainer = ({
  copyField,
  createDocument,
  deleteDocument,
  documentFields,
  history,
  match,
  moveField,
  ui,
  uiConfirm,
  uiDocumentCreate,
  unpublishDocument,
}) => {
  const { data: documents, loading } = useDataService(dataMapper.documents.list(match.params.projectId), [
    match.params.projectId
  ])

  // project id isn't a number, redirect to 404 page
  if (match.params.projectId && isNaN(match.params.projectId)) {
    return <NoProject />
  }

  // documents are done loading for project, but they aren't populated, assume 404 and redirect
  if (loading === false && !documents) {
    return <NoProject />
  }

  function createDocumentAction(value) {
    createDocument(match.params.projectId, history, {
      name: value
    })
  }

  function createDocumentHandler(value) {
    if (value === false) {
      history.push({ pathname: `${PATH_PROJECT}/${match.params.projectId}` })
    } else {
      history.push({ pathname: `${PATH_PROJECT}/${match.params.projectId}${PATH_DOCUMENT_NEW}` })
    }
    uiDocumentCreate(value)
  }

  function draggedDocumentHandler(file) {
    const reader = new FileReader()
    reader.readAsText(file)
    reader.onloadend = function() {
      // Create a new document, preventing the redirect, and with a body
      // Remove the file extension
      const fileName = file.name.replace(/\.[^/.]+$/, '')
      const markdownBody = reader.result
      const documentOptions = {
        preventRedirect: true,
        createFieldWithBody: markdownBody
      }
      createDocument(match.params.projectId, history, { name: fileName }, documentOptions)
    }
  }

  function fieldMoveHandler(oldDocumentId, newDocumentId, fieldId) {
    if (oldDocumentId === newDocumentId) return
    const field = documentFields[oldDocumentId][fieldId]
    moveField(match.params.projectId, oldDocumentId, newDocumentId, field)
  }

  function fieldCopyHandler(oldDocumentId, newDocumentId, fieldId) {
    if (oldDocumentId === newDocumentId) return
    const field = documentFields[oldDocumentId][fieldId]
    copyField(match.params.projectId, oldDocumentId, newDocumentId, field)
  }

  function unpublishDocumentHandler(document) {
    const message = (
      <>
        <p>{strings.UNPUBLISH_CONFIRMATION_TITLE} <span className="highlight">{document.name}</span>?</p>
        <p>{strings.UNPUBLISH_CONFIRMATION_DESCRIPTION}</p>
      </>
    )
    const confirmedLabel = strings.UNPUBLISH_CONFIRMATION_LABEL
    const confirmedAction = () => { unpublishDocument(document.id) }
    uiConfirm({ message, confirmedAction, confirmedLabel })
  }

  function removeDocumentHandler(document) {
    const message = (
      <span>{strings.DELETE_CONFIRMATION_TITLE_PREFIX} <span className="highlight">{document.name}</span> {strings.DELETE_CONFIRMATION_TITLE_SUFFIX}</span>
    )
    const confirmedLabel = strings.DELETE_CONFIRMATION_LABEL
    const confirmedAction = () => { deleteDocument(document.projectId, document.id, history) }
    uiConfirm({ message, confirmedAction, confirmedLabel })
  }

  const sortedDocuments = []
  if (documents) {
    Object.keys(documents).forEach((doc) => {
      sortedDocuments.push(documents[doc])
    })
    sortedDocuments.sort((a, b) => {
      return new Date(b.updatedAt) - new Date(a.updatedAt)
    })
  }

  return (
    <DocumentsListComponent
      createCallback={createDocumentHandler}
      createChangeHandler={createDocumentAction}
      creating={ui.documents.creating || match.params.documentId === PATH_DOCUMENT_NEW_PARAM}
      documents={sortedDocuments}
      draggedDocumentHandler={draggedDocumentHandler}
      fieldCopyHandler={fieldCopyHandler}
      fieldMoveHandler={fieldMoveHandler}
      loading={loading}
      projectId={Number(match.params.projectId)}
      removeDocumentHandler={removeDocumentHandler}
      unpublishDocumentHandler={unpublishDocumentHandler}
    />
  )
}

DocumentsListContainer.propTypes = {
  copyField: PropTypes.func.isRequired,
  createDocument: PropTypes.func.isRequired,
  deleteDocument: PropTypes.func.isRequired,
  documentFields: PropTypes.object,
  history: PropTypes.object.isRequired,
  match: PropTypes.object.isRequired,
  moveField: PropTypes.func.isRequired,
  ui: PropTypes.object.isRequired,
  uiConfirm: PropTypes.func.isRequired,
  uiDocumentCreate: PropTypes.func.isRequired,
  unpublishDocument: PropTypes.func.isRequired,
}

const mapStateToProps = (state) => {
  return {
    ui: state.ui,
    documentFields: state.documentFields.documentFieldsById,
  }
}

const mapDispatchToProps = {
  copyField,
  createDocument,
  deleteDocument,
  moveField,
  uiConfirm,
  uiDocumentCreate,
  unpublishDocument,
}


export default withRouter(
  connect(mapStateToProps, mapDispatchToProps)(DocumentsListContainer)
)
