import React, { useState } from 'react'
import PropTypes from 'prop-types'
import { Link } from 'react-router-dom'

import { MULTI_USER_PLAN_TYPES, PATH_PROJECT, PROJECT_ACCESS_LEVELS, URL_DOCUMENTATION } from 'Shared/constants'
import { ProjectIcon, RemoveIcon, SettingsIcon, TrashIcon, UnlockIcon } from 'Components/Icons'
import OrgPlanPermission from 'Components/Permission/OrgPlanPermission'
import { IconButton } from 'Components/Buttons'

import stars from './stars.svg'
import './_SpecialProject.scss'

const lsShowMessage = localStorage.getItem('sp-message')

const DashboardSpecialProject = ({ deleteHandler, project }) => {
  const [showMessage, setShowMessage] = useState(lsShowMessage)
  const publiclyReadable = project.accessLevel === PROJECT_ACCESS_LEVELS.READ

  function setLocalStorageIgnore() {
    setShowMessage(false)
    localStorage.setItem('sp-message', 'false')
  }

  return (
    <>
      <div className="special-project">
        <img className="special-project__stars" src={stars} width="67" height="78" alt="Stars" />
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
        </Link>
        <div className="special-project__actions">
          <OrgPlanPermission acceptedPlans={MULTI_USER_PLAN_TYPES}>
            {publiclyReadable &&
            <div className="project-list__public-token">
              <UnlockIcon width="18" height="18" />
              <span className="label">Everyone</span>
            </div>
            }
          </OrgPlanPermission>
          <div className="special-project__action-buttons">
            <Link aria-label="Project settings" to={`${PATH_PROJECT}/${project.id}/settings`} className="btn btn--blank">
              <SettingsIcon />
            </Link>
            <button aria-label="Delete this project" className="btn btn--blank" onClick={() => { deleteHandler(project.id) }}>
              <TrashIcon />
            </button>
          </div>
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
