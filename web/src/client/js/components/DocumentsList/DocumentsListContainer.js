import React from 'react'
import PropTypes from 'prop-types'
import { withRouter } from 'react-router-dom'
import { connect } from 'react-redux'

import { PATH_DOCUMENT_NEW, PATH_DOCUMENT_NEW_PARAM, PATH_PROJECT } from 'Shared/constants'
import useDataService from 'Hooks/useDataService'
import dataMapper from 'Libs/dataMapper'

import { createDocument } from 'Actions/document'
import { uiDocumentCreate } from 'Actions/ui'
import DocumentsListComponent from './DocumentsListComponent'

const DocumentsListContainer = ({ createDocument, uiDocumentCreate, history, ui, match }) => {
  const { data: documents } = useDataService(dataMapper.documents.list(match.params.projectId), [
    match.params.projectId
  ])

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

  function fieldMoveHandler(oldDocumentId, newDocumentId, fieldId) {
    if (oldDocumentId === newDocumentId) return
    console.log(`Move field: ${fieldId} from document: ${oldDocumentId} to document: ${newDocumentId}.`)
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
      fieldMoveHandler={fieldMoveHandler}
      projectId={Number(match.params.projectId)}/>
  )
}

DocumentsListContainer.propTypes = {
  createDocument: PropTypes.func.isRequired,
  uiDocumentCreate: PropTypes.func.isRequired,
  history: PropTypes.object.isRequired,
  ui: PropTypes.object.isRequired,
  match: PropTypes.object.isRequired
}

const mapStateToProps = (state) => {
  return {
    ui: state.ui
  }
}

const mapDispatchToProps = { createDocument, uiDocumentCreate }


export default withRouter(
  connect(mapStateToProps, mapDispatchToProps)(DocumentsListContainer)
)
