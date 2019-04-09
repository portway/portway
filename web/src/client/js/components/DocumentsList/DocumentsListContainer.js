import React from 'react'
import PropTypes from 'prop-types'
import { withRouter } from 'react-router-dom'

import useDataService from 'Hooks/useDataService'
import currentResource from 'Libs/currentResource'
import dataMapper from 'Libs/dataMapper'

import DocumentsListComponent from './DocumentsListComponent'

const DocumentsListContainer = ({ location, match }) => {
  const { data: project } = useDataService(currentResource('project', location.pathname), [
    location.pathname
  ])

  const { data: documents } = useDataService(
    dataMapper.projectDocuments.list(match.params.projectId),
    [match.params.projectId]
  )

  if (!project) return null

  return <DocumentsListComponent projectName={project.name} documents={documents} />
}

DocumentsListContainer.propTypes = {
  location: PropTypes.object.isRequired,
  match: PropTypes.object.isRequired
}

export default withRouter(DocumentsListContainer)
