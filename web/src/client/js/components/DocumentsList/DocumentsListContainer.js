import React from 'react'
import PropTypes from 'prop-types'
import { withRouter } from 'react-router-dom'
import { connect } from 'react-redux'

import Constants from 'Shared/constants'
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
    history.push({ pathname: `${Constants.PATH_PROJECT}/${match.params.projectId}/document/new` })
    uiDocumentCreate(value)
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
      creating={ui.documents.creating}
      documents={sortedDocuments}
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
