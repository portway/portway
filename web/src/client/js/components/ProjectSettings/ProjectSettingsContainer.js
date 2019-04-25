import React from 'react'
import PropTypes from 'prop-types'
import { withRouter } from 'react-router-dom'

import ProjectSettingsComponent from './ProjectSettingsComponent'

const ProjectSettingsContainer = ({ match }) => {
  return (
    <ProjectSettingsComponent projectId={match.params.projectId} setting={match.params.setting} />
  )
}

ProjectSettingsContainer.propTypes = {
  match: PropTypes.object.isRequired
}

export default withRouter(ProjectSettingsContainer)
