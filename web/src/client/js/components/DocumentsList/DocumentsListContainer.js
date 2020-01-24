import React, { useEffect } from 'react'
import PropTypes from 'prop-types'
import { useHistory, useParams } from 'react-router-dom'
import { connect } from 'react-redux'

import * as strings from 'Loc/strings'
import {
  PATH_DOCUMENT_NEW,
  PATH_DOCUMENT_NEW_PARAM,
  PATH_PROJECT,
  PROJECT_ROLE_IDS,
} from 'Shared/constants'
import { debounce } from 'Shared/utilities'

import useDataService from 'Hooks/useDataService'
import dataMapper from 'Libs/dataMapper'

import { createDocument, deleteDocument, unpublishDocument } from 'Actions/document'
import { copyField, moveField } from 'Actions/field'
import { clearSearch, searchDocuments } from 'Actions/search'
import { uiConfirm, uiDocumentCreate } from 'Actions/ui'
import DocumentsListComponent from './DocumentsListComponent'
import NoProject from './NoProject'

const DocumentsListContainer = ({
  clearSearch,
  copyField,
  createDocument,
  deleteDocument,
  documentFields,
  moveField,
  searchDocuments,
  searchResults,
  searchTerm,
  ui,
  uiConfirm,
  uiDocumentCreate,
  unpublishDocument,
}) => {
  const { documentId, projectId } = useParams()
  const history = useHistory()

  const { data: documents, loading } = useDataService(dataMapper.documents.list(projectId), [projectId])
  const { data: projectAssignments, loading: assignmentsLoading } = useDataService(dataMapper.users.currentUserProjectAssignments())

  let readOnly = null
  if (assignmentsLoading === false) {
    readOnly = projectAssignments[projectId] === undefined || projectAssignments[projectId].role === PROJECT_ROLE_IDS.READER
  }

  // trigger clear search action if project id changes
  useEffect(() => {
    clearSearch()
  }, [projectId, clearSearch])

  // project id isn't a number, redirect to 404 page
  if (projectId && isNaN(projectId)) {
    return <NoProject />
  }

  // documents are done loading for project, but they aren't populated, assume 404 and redirect
  if (loading === false && !documents) {
    return <NoProject />
  }

  function createDocumentAction(value) {
    createDocument(projectId, history, {
      name: value
    })
  }

  function createDocumentHandler(value) {
    if (value === false) {
      history.push({ pathname: `${PATH_PROJECT}/${projectId}` })
    } else {
      history.push({ pathname: `${PATH_PROJECT}/${projectId}${PATH_DOCUMENT_NEW}` })
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
      createDocument(projectId, history, { name: fileName }, documentOptions)
    }
  }

  function fieldMoveHandler(oldDocumentId, newDocumentId, fieldId) {
    if (oldDocumentId === newDocumentId) return
    const field = documentFields[oldDocumentId][fieldId]
    moveField(projectId, oldDocumentId, newDocumentId, field)
  }

  function fieldCopyHandler(oldDocumentId, newDocumentId, fieldId) {
    if (oldDocumentId === newDocumentId) return
    const field = documentFields[oldDocumentId][fieldId]
    copyField(projectId, oldDocumentId, newDocumentId, field)
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

  function clearSearchHandler() {
    clearSearch()
  }

  const searchDocumentsHandler = debounce(200, (inputValue) => {
    if (inputValue.trim() === '') {
      clearSearch()
      return
    }
    // if we have a project id, search for documents
    if (projectId && inputValue !== searchTerm) {
      searchDocuments(projectId, inputValue)
    }
  })

  let sortedSearchResults = null
  if (searchResults && searchTerm) {
    sortedSearchResults = Object.values(searchResults)
    sortedSearchResults.sort((a, b) => {
      return new Date(b.updatedAt) - new Date(a.updatedAt)
    })
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
      clearSearchHandler={clearSearchHandler}
      createCallback={createDocumentHandler}
      createChangeHandler={createDocumentAction}
      creating={ui.documents.creating || documentId === PATH_DOCUMENT_NEW_PARAM}
      documents={sortedSearchResults ? sortedSearchResults : sortedDocuments}
      draggedDocumentHandler={draggedDocumentHandler}
      fieldCopyHandler={fieldCopyHandler}
      fieldMoveHandler={fieldMoveHandler}
      loading={loading}
      projectId={Number(projectId)}
      readOnly={readOnly}
      removeDocumentHandler={removeDocumentHandler}
      searchDocumentsHandler={searchDocumentsHandler}
      unpublishDocumentHandler={unpublishDocumentHandler}
    />
  )
}

DocumentsListContainer.propTypes = {
  clearSearch: PropTypes.func,
  copyField: PropTypes.func.isRequired,
  createDocument: PropTypes.func.isRequired,
  deleteDocument: PropTypes.func.isRequired,
  documentFields: PropTypes.object,
  moveField: PropTypes.func.isRequired,
  searchDocuments: PropTypes.func.isRequired,
  searchResults: PropTypes.object,
  searchTerm: PropTypes.string,
  ui: PropTypes.object.isRequired,
  uiConfirm: PropTypes.func.isRequired,
  uiDocumentCreate: PropTypes.func.isRequired,
  unpublishDocument: PropTypes.func.isRequired,
}

const mapStateToProps = (state) => {
  return {
    ui: state.ui,
    documentFields: state.documentFields.documentFieldsById,
    searchResults: state.search.searchResultsByDocumentId,
    searchTerm: state.search.searchTerm,
  }
}

const mapDispatchToProps = {
  copyField,
  createDocument,
  clearSearch,
  deleteDocument,
  moveField,
  searchDocuments,
  uiConfirm,
  uiDocumentCreate,
  unpublishDocument,
}


export default connect(mapStateToProps, mapDispatchToProps)(DocumentsListContainer)
