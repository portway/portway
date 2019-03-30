import React, { useState } from 'react'
import PropTypes from 'prop-types'
import moment from 'moment'

import './Project.scss'
import DropdownComponent from 'Components/Dropdown/DropdownComponent'
import ProjectDocuments from './ProjectDocuments'
import ProjectIcon from 'Components/Icons/ProjectIcon'

function ProjectComponent({ project }) {
  const [expanded, setExpanded] = useState(false)
  function renderExpandState() {
    if (expanded) {
      return (<><span className="icon icon-caret-up" /> Show Less</>)
    } else {
      return (<><span className="icon icon-caret-down" /> Show Project Details</>)
    }
  }
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
          <li className="menu__item"><button className="btn btn--blank">Settings</button></li>
          <li className="menu__item"><button className="btn btn--blank">Duplicate...</button></li>
          <li className="menu__divider">
            <button className="btn btn--blank btn--danger">Delete...</button>
          </li>
        </DropdownComponent>
        <div className="project__details" hidden={!expanded}>
          <p>Last update by _USER_ | {moment(project.updatedAt).format('MMM Mo h:mma')}</p>
          <p className="small">
            Created by by _USER_ | {moment(project.createdAt).format('MMM Mo h:mma')}
          </p>
          <div className="project__statistics">
            <p className="small">
              134MB / 13 Documents
            </p>
          </div>
        </div>
      </header>
      <div className="project__expand note"
        aria-haspopup
        aria-expanded={expanded}
        aria-label="Toggle project statistics"
        role="button"
        onClick={() => { setExpanded(!expanded) }}
        onKeyDown={(e) => {
          if (e.key.toLowerCase() === 'enter') {
            setExpanded(!expanded)
          }
        }}
        tabIndex={0}>
        <div className="project__expand--details">
          {renderExpandState()}
        </div>
      </div>
      <ProjectDocuments project={project} />
    </div>
  )
}

ProjectComponent.propTypes = {
  project: PropTypes.object.isRequired
}

export default ProjectComponent
