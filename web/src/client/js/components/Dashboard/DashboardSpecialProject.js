import React, { lazy, useState } from 'react'
import PropTypes from 'prop-types'
import { Link } from 'react-router-dom'

import {
  MULTI_USER_PLAN_TYPES,
  PATH_PROJECT,
  PROJECT_ACCESS_LEVELS,
  PROJECT_ROLE_IDS,
  URL_DOCUMENTATION
} from 'Shared/constants'
import { ProjectIcon, RemoveIcon, SettingsIcon, TrashIcon, UnlockIcon } from 'Components/Icons'
import { IconButton } from 'Components/Buttons'

import OrgPlanPermission from 'Components/Permission/OrgPlanPermission'
import ProjectPermission from 'Components/Permission/ProjectPermission'
import Stars from './Stars'

// Lazy loading because not all users have access to this
const ProjectUsersContainer = lazy(() => import(/* webpackChunkName: 'ProjectUsersContainer' */ 'Components/ProjectUsers/ProjectUsersContainer'))

import './_SpecialProject.scss'

const lsShowMessage = localStorage.getItem('sp-message')

const DashboardSpecialProject = ({ deleteHandler, project }) => {
  const [showMessage, setShowMessage] = useState(lsShowMessage)
  const assignedProject = project.accessLevel == null
  const publiclyReadable = project.accessLevel === PROJECT_ACCESS_LEVELS.READ

  function setLocalStorageIgnore() {
    setShowMessage(false)
    localStorage.setItem('sp-message', 'false')
  }

  return (
    <>
      <div className="special-project">
        <Stars />
        <Link className="special-project__link" to={`${PATH_PROJECT}/${project.id}`}>
          <div className="special-project__title">
            <ProjectIcon fill="var(--color-brand)" width="32" height="32" />
            <div className="special-project__title-container">
              <h3>{project.name}</h3>
              {project.description &&
              <span className="note">{project.description}</span>
              }
            </div>
          </div>
          <OrgPlanPermission acceptedPlans={MULTI_USER_PLAN_TYPES}>
            {publiclyReadable &&
              <div
                aria-label="Organization access"
                className="special-project__public-token"
                title="Everyone can view this project"
              >
                <UnlockIcon fill="var(--color-green-dark)" width="14" height="14" />
              </div>
            }
          </OrgPlanPermission>
        </Link>
        <div className="special-project__team">
          <OrgPlanPermission acceptedPlans={MULTI_USER_PLAN_TYPES}>
            {assignedProject && <ProjectUsersContainer collapsed={true} projectId={project.id} />}
          </OrgPlanPermission>
        </div>
        <div className="special-project__actions">
          <ProjectPermission acceptedRoleIds={[PROJECT_ROLE_IDS.ADMIN]} projectIdOverride={project.id}>
            <div className="special-project__action-buttons">
              <Link aria-label="Project settings" to={`${PATH_PROJECT}/${project.id}/settings`} className="btn btn--blank">
                <SettingsIcon />
              </Link>
              <button aria-label="Delete this project" className="btn btn--blank" onClick={() => { deleteHandler(project.id) }}>
                <TrashIcon />
              </button>
            </div>
          </ProjectPermission>
        </div>
      </div>
      {JSON.parse(showMessage) !== false &&
      <div className="special-project__description">
        <div className="special-project__description-content">
          <div>
            We’ve created a sample project for you to learn the basics of Portway.<> </>
            <Link to={`${PATH_PROJECT}/${project.id}`}>Edit it</Link>,
            delete it, or do anything else you can think of with the<> </>
            <a href={URL_DOCUMENTATION} target="_blank" rel="noopener noreferrer">Portway API</a>.
          </div>
          <OrgPlanPermission acceptedPlans={[MULTI_USER_PLAN_TYPES]}>
            <div className="special-project__multi-plan">
              <UnlockIcon fill="#ffffff" />
              <span className="label">Everyone in your organization can edit this project</span>
            </div>
          </OrgPlanPermission>
        </div>
        <IconButton color="brand" onClick={setLocalStorageIgnore}>
          <RemoveIcon fill="#ffffff" width="14" height="14" />
        </IconButton>
      </div>
      }
    </>
  )
}

DashboardSpecialProject.propTypes = {
  deleteHandler: PropTypes.func.isRequired,
  project: PropTypes.object.isRequired,
}

export default DashboardSpecialProject
