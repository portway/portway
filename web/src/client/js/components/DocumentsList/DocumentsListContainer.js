import React from 'react'
import PropTypes from 'prop-types'
import { withRouter } from 'react-router-dom'
import { connect } from 'react-redux'

import { PATH_DOCUMENT_NEW, PATH_DOCUMENT_NEW_PARAM, PATH_PROJECT } from 'Shared/constants'
import useDataService from 'Hooks/useDataService'
import dataMapper from 'Libs/dataMapper'

import { createDocument } from 'Actions/document'
import { copyField, moveField } from 'Actions/field'
import { uiDocumentCreate } from 'Actions/ui'
import DocumentsListComponent from './DocumentsListComponent'

const DocumentsListContainer = ({
  createDocument,
  copyField,
  documentFields,
  uiDocumentCreate,
  history,
  ui,
  match,
  moveField
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
      projectId={Number(match.params.projectId)}/>
  )
}

DocumentsListContainer.propTypes = {
  createDocument: PropTypes.func.isRequired,
  copyField: PropTypes.func.isRequired,
  documentFields: PropTypes.object,
  uiDocumentCreate: PropTypes.func.isRequired,
  history: PropTypes.object.isRequired,
  ui: PropTypes.object.isRequired,
  match: PropTypes.object.isRequired,
  moveField: PropTypes.func.isRequired,
}

const mapStateToProps = (state) => {
  return {
    ui: state.ui,
    documentFields: state.documentFields.documentFieldsById,
  }
}

const mapDispatchToProps = { createDocument, copyField, moveField, uiDocumentCreate }


export default withRouter(
  connect(mapStateToProps, mapDispatchToProps)(DocumentsListContainer)
)
