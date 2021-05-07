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
import StatusSpinnerComponent from 'Components/StatusSpinner/StatusSpinnerComponent'

import './_ProjectToolbar.scss'

const ProjectToolbarComponent = ({ projectId, status }) => {
  return (
    <footer className="project-toolbar">
      {!status.visible &&
      <div className="project-toolbar__actions">
        <OrgPermission
          acceptedRoleIds={[ORGANIZATION_ROLE_IDS.OWNER, ORGANIZATION_ROLE_IDS.ADMIN]}
          acceptedSettings={[ORGANIZATION_SETTINGS.ALLOW_USER_PROJECT_CREATION]}>
          <Link
            className="btn btn--blank btn--with-circular-icon"
            title="Create a new project"
            to={PATH_PROJECT_CREATE}>
            <AddIcon />
            <span className="label">New project</span>
          </Link>
        </OrgPermission>
        <ProjectPermission acceptedRoleIds={[PROJECT_ROLE_IDS.ADMIN]}>
          <NavLink to={`${PATH_PROJECT}/${projectId}/settings`}
            className="btn btn--blank btn--with-circular-icon navbar__project-settings-link"
            title="Adjust this project's settings">
            <SettingsIcon />
            <span className="label">Project settings</span>
          </NavLink>
        </ProjectPermission>
      </div>
      }

      {status.visible &&
        <StatusSpinnerComponent align="leading" label={status.label} />
      }

    </footer>
  )
}

ProjectToolbarComponent.propTypes = {
  projectId: PropTypes.string.isRequired,
  status: PropTypes.object.isRequired,
}

export default ProjectToolbarComponent
