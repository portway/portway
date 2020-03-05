import React from 'react'
import PropTypes from 'prop-types'
import { Link } from 'react-router-dom'

import { MULTI_USER_PLAN_TYPES, PATH_PROJECT } from 'Shared/constants'
import { ProjectIcon, UnlockIcon } from 'Components/Icons'
import OrgPlanPermission from 'Components/Permission/OrgPlanPermission'

const ProjectLink = ({ project }) => {
  const privateProject = project.accessLevel == null
  return (
    <Link className="project-list__link" to={`${PATH_PROJECT}/${project.id}`}>
      <div className="project-list__title">
        <ProjectIcon
          className="project-list__icon"
          fill={!privateProject ? 'var(--color-gray-30)' : 'var(--theme-icon-color)'}
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
      <OrgPlanPermission acceptedPlans={MULTI_USER_PLAN_TYPES}>
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
  )
}

ProjectLink.propTypes = {
  project: PropTypes.object.isRequired,
}

export default ProjectLink
