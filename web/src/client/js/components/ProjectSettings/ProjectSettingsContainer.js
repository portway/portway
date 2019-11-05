import React from 'react'
import PropTypes from 'prop-types'
import { withRouter, Redirect } from 'react-router-dom'

import { PATH_PROJECTS, PROJECT_ROLE_IDS } from 'Shared/constants'
import ProjectPermission from 'Components/Permission/ProjectPermission'
import ProjectSettingsComponent from './ProjectSettingsComponent'

const ProjectSettingsContainer = ({ match }) => {
  return (
    <ProjectPermission
      projectId={match.params.projectId}
      acceptedRoleIds={[PROJECT_ROLE_IDS.ADMIN]}
      elseRender={(<Redirect to={PATH_PROJECTS} />)}>
      <ProjectSettingsComponent
        projectId={match.params.projectId}
        setting={match.params.setting}
      />
    </ProjectPermission>
  )
}

ProjectSettingsContainer.propTypes = {
  match: PropTypes.object.isRequired
}

export default withRouter(ProjectSettingsContainer)
