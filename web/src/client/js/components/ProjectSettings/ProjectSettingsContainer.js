import React from 'react'
import PropTypes from 'prop-types'
import { Redirect, useParams } from 'react-router-dom'

import { PATH_PROJECTS, PROJECT_ROLE_IDS } from 'Shared/constants'
import ProjectPermission from 'Components/Permission/ProjectPermission'
import ProjectSettingsComponent from './ProjectSettingsComponent'

const ProjectSettingsContainer = () => {
  const { setting, projectId } = useParams()
  return (
    <ProjectPermission acceptedRoleIds={[PROJECT_ROLE_IDS.ADMIN]} elseRender={(<Redirect to={PATH_PROJECTS} />)}>
      <ProjectSettingsComponent
        projectId={projectId}
        setting={setting}
      />
    </ProjectPermission>
  )
}

ProjectSettingsContainer.propTypes = {
  match: PropTypes.object.isRequired
}

export default ProjectSettingsContainer
