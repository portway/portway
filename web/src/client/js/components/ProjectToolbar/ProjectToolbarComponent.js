import React from 'react'
import PropTypes from 'prop-types'
import { Link, NavLink } from 'react-router-dom'
import moment from 'moment'

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
import ProjectUsersContainer from 'Components/ProjectUsers/ProjectUsersContainer'

import './_ProjectToolbar.scss'

const ProjectToolbarComponent = ({ document, projectId }) => {
  return (
    <footer className="project-toolbar">
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
      <ProjectPermission acceptedRoleIds={[PROJECT_ROLE_IDS.ADMIN]} projectId={projectId}>
        <NavLink to={`${PATH_PROJECT}/${projectId}/settings`}
          className="btn btn--blank btn--with-circular-icon navbar__project-settings-link"
          title="Adjust this project's settings">
          <SettingsIcon />
          <span className="label">Project Settings</span>
        </NavLink>
      </ProjectPermission>
      <div className="project-toolbar__team">
        <span className="project-toolbar__team-label">Your Team:</span>
        <ProjectUsersContainer projectId={projectId} collapsed />
      </div>
      {document &&
      <div className="project-toolbar__document-info">
        Last update: {moment(document.updatedAt).format('ddd, hA')} –&nbsp;
        {document.publishedVersionId &&
        <b>Published</b>
        }
      </div>
      }
    </footer>
  )
}

ProjectToolbarComponent.propTypes = {
  document: PropTypes.object,
  projectId: PropTypes.string.isRequired
}

export default ProjectToolbarComponent
