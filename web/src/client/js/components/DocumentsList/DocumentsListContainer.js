import React from 'react'
import PropTypes from 'prop-types'
import { withRouter } from 'react-router-dom'
import { connect } from 'react-redux'

import { PATH_DOCUMENT_NEW, PATH_DOCUMENT_NEW_PARAM, PATH_PROJECT } from 'Shared/constants'
import useDataService from 'Hooks/useDataService'
import dataMapper from 'Libs/dataMapper'

import { createDocument, deleteDocument, unpublishDocument } from 'Actions/document'
import { copyField, moveField } from 'Actions/field'
import { uiConfirm, uiDocumentCreate } from 'Actions/ui'
import DocumentsListComponent from './DocumentsListComponent'

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

  function createDocumentAction(value) {
    createDocument(match.params.projectId, history, {
      name: value
    }, false, ' ')
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
      createDocument(match.params.projectId, history, { name: fileName }, true, markdownBody)
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
        <p>Unpublish the document <span className="highlight">{document.name}</span>?</p>
        <p>If you are using this document in a live application, it will be removed.</p>
      </>
    )
    const confirmedLabel = `Yes, unpublish this document`
    const confirmedAction = () => { unpublishDocument(document.id) }
    uiConfirm({ message, confirmedAction, confirmedLabel })
  }

  function removeDocumentHandler(document) {
    const message = (
      <span>Delete the document <span className="highlight">{document.name}</span> and all of its fields?</span>
    )
    const confirmedLabel = `Yes, delete this document`
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
