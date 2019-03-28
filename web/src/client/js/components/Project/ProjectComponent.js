import React from 'react'
import PropTypes from 'prop-types'
import moment from 'moment'

import './Project.scss'
import DropdownComponent from 'Components/Dropdown/DropdownComponent'
import ProjectDocuments from './ProjectDocuments'
import ProjectIcon from 'Components/Icons/ProjectIcon'

function ProjectComponent({ project }) {
  const settingsButton = {
    className: 'btn btn--blank btn--with-circular-icon',
    icon: 'icon-menu-more',
    label: ''
  }
  return (
    <div className="project">
      <header className="project__header">
        <h1 className="header--with-icon">
          <ProjectIcon className="project__icon" /> {project.name}
        </h1>
        <DropdownComponent className="project__dropdown" button={settingsButton}>
          <li><button className="btn btn--blank">Settings</button></li>
          <li><button className="btn btn--blank">Duplicate...</button></li>
          <li className="menu__divider">
            <button className="btn btn--blank btn--warning">Delete Project...</button>
          </li>
        </DropdownComponent>
        <div className="project__details">
          <p>Last update by _USER_ | {moment(project.updatedAt).format('MMM Mo h:mma')}</p>
          <p className="small">
            Created by by _USER_ | {moment(project.createdAt).format('MMM Mo h:mma')}
          </p>
        </div>
        <div className="project__expand note">
          <div className="project__expand--details">
            <span className="icon icon-caret-up" /> Show Less
          </div>
        </div>
      </header>
      <ProjectDocuments project={project} />
    </div>
  )
}

ProjectComponent.propTypes = {
  project: PropTypes.object.isRequired
}

export default ProjectComponent
