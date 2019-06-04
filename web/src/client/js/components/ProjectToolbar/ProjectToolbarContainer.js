import React from 'react'
import PropTypes from 'prop-types'
import { withRouter } from 'react-router-dom'

import ProjectToolbarComponent from './ProjectToolbarComponent'
import useDataService from 'Hooks/useDataService'
import dataMapper from 'Libs/dataMapper'

const ProjectToolbarContainer = ({ match }) => {
  const projectId = match.params.projectId
  const documentId = match.params.documentId
  const { data: document } = useDataService(dataMapper.documents.id(projectId, documentId), [projectId, documentId])
  return <ProjectToolbarComponent projectId={projectId} document={document} />
}

ProjectToolbarContainer.propTypes = {
  match: PropTypes.object.isRequired
}

export default withRouter(ProjectToolbarContainer)
