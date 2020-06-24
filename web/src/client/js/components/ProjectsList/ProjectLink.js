import React from 'react'
import PropTypes from 'prop-types'
import { Link } from 'react-router-dom'
import cx from 'classnames'

import { MULTI_USER_PLAN_TYPES, PATH_PROJECT } from 'Shared/constants'
import { ProjectIcon, UnlockIcon } from 'Components/Icons'

import OrgPlanPermission from 'Components/Permission/OrgPlanPermission'
import SpecialProjectDescription from './SpecialProjectDescription'
import Stars from './Stars'

const ProjectLink = ({ project, special }) => {
  const privateProject = project.accessLevel == null
  const projectListClasses = cx({
    'project-list__link': true,
    'project-list__link--special': special,
  })

  function getProjectIconFill() {
    if (special) {
      return 'var(--color-brand)'
    }
    return !privateProject ? 'var(--color-gray-30)' : 'var(--color-blue)'
  }

  return (
    <>
      <Link className={projectListClasses} to={`${PATH_PROJECT}/${project.id}`}>
        {special && <Stars />}
        <div className="project-list__title">
          <ProjectIcon
            className="project-list__icon"
            fill={getProjectIconFill()}
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
      {special && <SpecialProjectDescription project={project} />}
    </>
  )
}

ProjectLink.propTypes = {
  project: PropTypes.object.isRequired,
  special: PropTypes.bool
}

export default ProjectLink
