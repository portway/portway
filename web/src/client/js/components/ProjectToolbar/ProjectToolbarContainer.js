import React from 'react'
import PropTypes from 'prop-types'
import { withRouter } from 'react-router-dom'

import ProjectToolbarComponent from './ProjectToolbarComponent'

const ProjectToolbarContainer = ({ match }) => {
  const projectId = match.params.projectId
  return <ProjectToolbarComponent projectId={projectId} />
}

ProjectToolbarContainer.propTypes = {
  match: PropTypes.object.isRequired
}

export default withRouter(ProjectToolbarContainer)
