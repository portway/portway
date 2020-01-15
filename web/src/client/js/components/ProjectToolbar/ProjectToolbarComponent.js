import React from 'react'
import PropTypes from 'prop-types'
import { Link, NavLink } from 'react-router-dom'

import {
  ORGANIZATION_ROLE_IDS,
  ORGANIZATION_SETTINGS,
  PATH_PROJECT,
  PATH_PROJECT_CREATE,
  PROJECT_ROLE_IDS
} from 'Shared/constants'
import { AddIcon, SettingsIcon } from 'Components/Icons'
import OrgPermission from 'Components/Permission/OrgPermission'
import ProjectPermission from 'Components/Permission/ProjectPermission'

import './_ProjectToolbar.scss'

const ProjectToolbarComponent = ({ projectId }) => {
  return (
    <ProjectPermission acceptedRoleIds={[PROJECT_ROLE_IDS.ADMIN, PROJECT_ROLE_IDS.CONTRIBUTOR]}>
      <footer className="project-toolbar">
        <>
          <OrgPermission
            acceptedRoleIds={[ORGANIZATION_ROLE_IDS.OWNER, ORGANIZATION_ROLE_IDS.ADMIN]}
            acceptedSettings={[ORGANIZATION_SETTINGS.ALLOW_USER_PROJECT_CREATION]}>
            <Link
              className="btn btn--blank btn--with-circular-icon"
              title="Create a new project"
              to={PATH_PROJECT_CREATE}>
              <AddIcon />
              <span className="label">New Project</span>
            </Link>
          </OrgPermission>
          <NavLink to={`${PATH_PROJECT}/${projectId}/settings`}
            className="btn btn--blank btn--with-circular-icon navbar__project-settings-link"
            title="Adjust this project's settings">
            <SettingsIcon />
            <span className="label">Project Settings</span>
          </NavLink>
        </>
      </footer>
    </ProjectPermission>
  )
}

ProjectToolbarComponent.propTypes = {
  projectId: PropTypes.string.isRequired,
}

export default ProjectToolbarComponent
