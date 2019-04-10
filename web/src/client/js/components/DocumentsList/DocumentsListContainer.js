import React from 'react'
import PropTypes from 'prop-types'
import { withRouter } from 'react-router-dom'
import { connect } from 'react-redux'

import useDataService from 'Hooks/useDataService'
import dataMapper from 'Libs/dataMapper'

import { documentCreate } from 'Actions/ui'
import DocumentsListComponent from './DocumentsListComponent'

const DocumentsListContainer = ({ documentCreate, ui, match }) => {
  const { data: documents } = useDataService(dataMapper.documents.list(match.params.projectId), [
    match.params.projectId
  ])

  function createDocumentHandler(value) {
    documentCreate(value)
  }

  return (
    <DocumentsListComponent
      createCallback={createDocumentHandler}
      creating={ui.documents.creating}
      documents={documents} />
  )
}

DocumentsListContainer.propTypes = {
  documentCreate: PropTypes.func.isRequired,
  ui: PropTypes.object.isRequired,
  match: PropTypes.object.isRequired
}

const mapStateToProps = (state) => {
  return {
    ui: state.ui
  }
}

const mapDispatchToProps = { documentCreate }


export default withRouter(
  connect(mapStateToProps, mapDispatchToProps)(DocumentsListContainer)
)
