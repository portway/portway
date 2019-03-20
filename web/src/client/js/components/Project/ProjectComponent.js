import React from 'react'
import PropTypes from 'prop-types'
import moment from 'moment'

import './Project.scss'
import DropdownComponent from 'Components/Dropdown/DropdownComponent'

function ProjectComponent({ project }) {
  const settingsButton = {
    className: 'btn btn--blank btn--with-circular-icon',
    icon: 'icon-menu-more',
    label: ''
  }
  return (
    <div className="project">
      <header className="project__details">
        <h2 className="header--with-icon">
          <span className="icon icon-project" /> {project.name}
        </h2>
        <DropdownComponent button={settingsButton}>
          <li>Hey</li>
        </DropdownComponent>
        <p>Last update by _USER_ | {moment(project.updatedAt).format('MMM Mo h:mma')}</p>
        <p className="small">
          Created by by _USER_ | {moment(project.createdAt).format('MMM Mo h:mma')}
        </p>
      </header>
      <div className="project__expand h-sixth-level">
        <div className="project__expand--details">
          <span className="icon icon-caret-up" /> Show Less
        </div>
      </div>
    </div>
  )
}

ProjectComponent.propTypes = {
  project: PropTypes.object.isRequired
}

export default ProjectComponent
