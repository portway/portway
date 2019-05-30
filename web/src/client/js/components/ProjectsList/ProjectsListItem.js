import React from 'react'
import PropTypes from 'prop-types'
import { Link } from 'react-router-dom'

import { PATH_PROJECT, PROJECT_ROLE_IDS } from 'Shared/constants'
import { ProjectIcon, SettingsIcon, TrashIcon } from 'Components/Icons'
import ProjectPermission from 'Components/Permission/ProjectPermission'
import ProjectUsersContainer from 'Components/ProjectUsers/ProjectUsersContainer'

const ProjectsListItem = ({
  projectId,
  project,
  handleDelete
}) => {
  return (
    <li className="project-list__item">
      <div className="project-list__info">
        <Link className="project-list__link" to={`${PATH_PROJECT}/${projectId}`}>
          <ProjectIcon className="project-list__icon" width="32" height="32" />
          <h3 className="project-list__title">{project.name}</h3>
        </Link>
        <div className="project-list__team">
          <ProjectUsersContainer collapsed={true} projectId={projectId} />
        </div>
      </div>
      <div className="project-list__actions">
        <ProjectPermission projectId={projectId} acceptedRoleIds={[PROJECT_ROLE_IDS.ADMIN]}>
          <Link to={`/project/${projectId}/settings`} className="btn btn--blank btn--with-circular-icon">
            <SettingsIcon />
          </Link>
          <button className="btn btn--blank btn--with-circular-icon" onClick={handleDelete}>
            <TrashIcon />
          </button>
        </ProjectPermission>
      </div>
    </li>
  )
}

ProjectsListItem.propTypes = {
  activeProjectId: PropTypes.string,
  animate: PropTypes.bool,
  callback: PropTypes.func.isRequired,
  projectId: PropTypes.string.isRequired,
  project: PropTypes.object.isRequired,
  handleDelete: PropTypes.func.isRequired
}

export default ProjectsListItem
