/* eslint-disable jsx-a11y/no-noninteractive-element-to-interactive-role */
import React, { lazy, useRef } from 'react'
import PropTypes from 'prop-types'
import { Link } from 'react-router-dom'

import { MULTI_USER_PLAN_TYPES, PATH_PROJECT, PROJECT_ROLE_IDS, ORG_SUBSCRIPTION_STATUS } from 'Shared/constants'
import { ProjectIcon, SettingsIcon, TrashIcon, UnlockIcon } from 'Components/Icons'
import OrgPlanPermission from 'Components/Permission/OrgPlanPermission'
import ProjectPermission from 'Components/Permission/ProjectPermission'

// Lazy loading because not all users have access to this
const ProjectUsersContainer = lazy(() => import(/* webpackChunkName: 'ProjectUsersContainer' */ 'Components/ProjectUsers/ProjectUsersContainer'))

const ProjectsListItem = ({ projectId, project, handleDelete }) => {
  const itemRef = useRef()
  const privateProject = project.accessLevel == null

  return (
    <li className="project-list__item" name={project.name}>
      <Link className="project-list__link" to={`${PATH_PROJECT}/${projectId}`}>
        <div className="project-list__title">
          <ProjectIcon
            className="project-list__icon"
            fill={!privateProject ? 'var(--color-gray-30)' : 'var(--color-blue)'}
            width="32"
            height="32"
          />
          <div className="project-list__title-container">
            <h3>{project.name}</h3>
            {project.description &&
            <span className="note">{project.description}</span>
            }
          </div>
        </div>
        <OrgPlanPermission acceptedPlans={MULTI_USER_PLAN_TYPES} acceptedSubscriptionStatuses={[ORG_SUBSCRIPTION_STATUS.ACTIVE]}>
          {!privateProject &&
            <div
              aria-label="Organization access"
              className="project-list__public-token"
              title="Everyone can view this project"
            >
              <UnlockIcon fill="var(--color-green-dark)" width="14" height="14" />
            </div>
          }
        </OrgPlanPermission>
      </Link>
      <div className="project-list__team">
        <OrgPlanPermission acceptedPlans={MULTI_USER_PLAN_TYPES} acceptedSubscriptionStatuses={[ORG_SUBSCRIPTION_STATUS.ACTIVE]}>
          {privateProject && <ProjectUsersContainer collapsed={true} projectId={projectId} />}
        </OrgPlanPermission>
      </div>
      <div className="project-list__actions" ref={itemRef}>
        <ProjectPermission acceptedRoleIds={[PROJECT_ROLE_IDS.ADMIN]} projectIdOverride={projectId}>
          <div className="project-list__action-buttons">
            <Link aria-label="Project settings" to={`/project/${projectId}/settings`} className="btn btn--blank">
              <SettingsIcon />
            </Link>
            <button
              aria-label="Delete project"
              name="deleteProject"
              className="btn btn--blank"
              onClick={handleDelete}
            >
              <TrashIcon />
            </button>
          </div>
        </ProjectPermission>
      </div>
    </li>
  )
}

ProjectsListItem.propTypes = {
  projectId: PropTypes.number.isRequired,
  project: PropTypes.object.isRequired,
  handleDelete: PropTypes.func.isRequired,
  special: PropTypes.bool,
}

export default ProjectsListItem
