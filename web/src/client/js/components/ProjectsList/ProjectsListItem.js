import React from 'react'
import PropTypes from 'prop-types'
import { Link } from 'react-router-dom'

import { PATH_PROJECT, PROJECT_ROLE_IDS } from 'Shared/constants'
import { ProjectIcon } from 'Components/Icons'
import ProjectPermission from 'Components/Permission/ProjectPermission'
import ProjectUsersContainer from 'Components/ProjectUsers/ProjectUsersContainer'

const ProjectsListItem = ({
  projectId,
  project,
  handleDelete
}) => {
  return (
    <li className="project-list__item">
      <Link to={`${PATH_PROJECT}/${projectId}`} className="project-list__info">
        <ProjectIcon className="project-list__icon" width="24" height="24" />
        <h3 className="project-list__title">{project.name}</h3>
        <p className="project-list__item-meta">Last updated by _USER_</p>
        <ProjectUsersContainer collapsed={true} projectId={projectId} />
      </Link>
      <div className="project-list__actions">
        <div className="project-list__actions-start">
          <ProjectPermission projectId={projectId} acceptedRoleIds={[PROJECT_ROLE_IDS.ADMIN]}>
            <button className="btn btn--blank btn--danger" onClick={handleDelete}>
              Delete
            </button>
          </ProjectPermission>
        </div>
        <div className="project-list__actions-end">
          <ProjectPermission projectId={projectId} acceptedRoleIds={[PROJECT_ROLE_IDS.ADMIN]}>
            <button className="btn btn--blank">Duplicate</button>
            <Link to={`/project/${projectId}/settings`} className="btn btn--blank">Settings</Link>
          </ProjectPermission>
        </div>
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
