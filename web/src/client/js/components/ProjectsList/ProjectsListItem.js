/* eslint-disable jsx-a11y/no-noninteractive-element-to-interactive-role */
import React, { useRef } from 'react'
import PropTypes from 'prop-types'
import { Link } from 'react-router-dom'

import { PATH_PROJECT, PROJECT_ROLE_IDS } from 'Shared/constants'
import { ProjectIcon, SettingsIcon, TrashIcon } from 'Components/Icons'
import ProjectPermission from 'Components/Permission/ProjectPermission'
import ProjectUsersContainer from 'Components/ProjectUsers/ProjectUsersContainer'

const ProjectsListItem = ({ history, projectId, project, handleDelete }) => {
  const itemRef = useRef()

  function itemClickHandler(e) {
    if (e.target === itemRef.current) {
      history.push(`${PATH_PROJECT}/${projectId}`)
    }
  }

  return (
    <li
      className="project-list__item"
      onClick={itemClickHandler}
      onKeyDown={itemClickHandler}
      tabIndex={0}
      role="button">
      <Link className="project-list__link" to={`${PATH_PROJECT}/${projectId}`}>
        <div className="project-list__title">
          <ProjectIcon className="project-list__icon" width="32" height="32" />
          <div className="project-list__title-container">
            <h3>{project.name}</h3>
            {project.description &&
            <span className="note">{project.description}</span>
            }
          </div>
        </div>
        <div className="project-list__team">
          <ProjectUsersContainer collapsed={true} projectId={projectId} />
        </div>
      </Link>
      <div className="project-list__actions" ref={itemRef}>
        <ProjectPermission projectId={projectId} acceptedRoleIds={[PROJECT_ROLE_IDS.ADMIN]}>
          <Link aria-label="Project settings" to={`/project/${projectId}/settings`} className="btn btn--blank btn--with-circular-icon">
            <SettingsIcon />
          </Link>
          <button
            aria-label="Delete project"
            className="btn btn--blank btn--with-circular-icon"
            onClick={handleDelete}
          >
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
  history: PropTypes.object,
  projectId: PropTypes.string.isRequired,
  project: PropTypes.object.isRequired,
  handleDelete: PropTypes.func.isRequired
}

export default ProjectsListItem
