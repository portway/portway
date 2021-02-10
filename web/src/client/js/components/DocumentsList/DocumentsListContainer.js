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

const DocumentsListContainer = ({
  clearSearch,
  copyField,
  createDocument,
  createMode,
  deleteDocument,
  documentFields,
  isCreating,
  isSearching,
  moveField,
  searchDocuments,
  searchResults,
  searchTerm,
  uiConfirm,
  uiDocumentCreate,
  unpublishDocument,
  projectDocumentsLoading
}) => {
  const { documentId, projectId } = useParams()
  const history = useHistory()

  // trigger refetching if projectDocumentsLoading[projectId] gets set to null, this happens when there's a remote org doc change event
  const { data: documents, loading } = useDataService(dataMapper.documents.list(projectId), [projectId, projectDocumentsLoading[projectId] == null])
  const { data: projectAssignments, loading: assignmentsLoading } = useDataService(dataMapper.users.currentUserProjectAssignments())

  // trigger clear search action if project id changes
  useEffect(() => {
    clearSearch()
  }, [projectId, clearSearch])

  // readOnly means the user has READ only access, or it is a public project with no direct assignment
  // readOnly does NOT mean edit mode / outline mode
  let readOnly = false
  if (assignmentsLoading === false) {
    readOnly = projectAssignments[projectId] === undefined || projectAssignments[projectId].role === PROJECT_ROLE_IDS.READER
  }

  // documents are done loading for project, but they aren't populated, assume 404 and redirect
  if (loading === false && !documents) {
    return null
  }

  if (loading == null) { return null}

  function createDocumentAction(value) {
    createDocument(projectId, history, {
      name: value
    })
  }

  function toggleCreateMode(value) {
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
    const options = {
      confirmedAction: () => { unpublishDocument(document.id, projectId) },
      confirmedLabel: strings.UNPUBLISH_CONFIRMATION_LABEL,
      theme: 'danger'
    }
    uiConfirm({ message, options })
  }

  function removeDocumentHandler(document) {
    const message = (
      <span>{strings.DELETE_CONFIRMATION_TITLE_PREFIX} <span className="highlight">{document.name}</span> {strings.DELETE_CONFIRMATION_TITLE_SUFFIX}</span>
    )
    const options = {
      confirmedAction: () => { deleteDocument(document.projectId, document.id, history) },
      confirmedLabel: strings.DELETE_CONFIRMATION_LABEL,
      theme: 'danger'
    }
    uiConfirm({ message, options })
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
      toggleCreateMode={toggleCreateMode}
      createDocumentHandler={createDocumentAction}
      createMode={createMode || documentId === PATH_DOCUMENT_NEW_PARAM}
      documents={sortedSearchResults ? sortedSearchResults : sortedDocuments}
      draggedDocumentHandler={draggedDocumentHandler}
      fieldCopyHandler={fieldCopyHandler}
      fieldMoveHandler={fieldMoveHandler}
      isCreating={isCreating}
      isSearching={isSearching}
      loading={loading || assignmentsLoading}
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
  createMode: PropTypes.bool.isRequired,
  deleteDocument: PropTypes.func.isRequired,
  documentFields: PropTypes.object,
  isCreating: PropTypes.bool.isRequired,
  isSearching: PropTypes.bool.isRequired,
  moveField: PropTypes.func.isRequired,
  searchDocuments: PropTypes.func.isRequired,
  searchResults: PropTypes.object,
  searchTerm: PropTypes.string,
  uiConfirm: PropTypes.func.isRequired,
  uiDocumentCreate: PropTypes.func.isRequired,
  unpublishDocument: PropTypes.func.isRequired,
  projectDocumentsLoading: PropTypes.object.isRequired
}

const mapStateToProps = (state) => {
  return {
    createMode: state.ui.documents.createMode,
    documentFields: state.documentFields.documentFieldsById,
    isCreating: state.ui.documents.isCreating,
    isSearching: state.ui.documents.isSearching,
    searchResults: state.search.searchResultsByDocumentId,
    searchTerm: state.search.searchTerm,
    projectDocumentsLoading: state.documents.loading.byProject
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
