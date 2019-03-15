import React from 'react'
import PropTypes from 'prop-types'

import { Link } from 'react-router-dom'

const ProjectsListItem = ({ projectId, project }) => {
  return (
    <li>
      <div className="project-list__item project-list__item--disabled" role="menu" tabIndex="0">
        <div className="project-list__info">
          <span className="icon icon-project" />
          <span>
            <h3 className="project-list__title">{project.name}</h3>
            <p className="project-list__item-meta">Last updated by _USER_</p>
          </span>
        </div>
        <div className="project-list__actions">
          <button className="btn btn--blank btn--warning">Delete</button>
          <button className="btn btn--blank">Duplicate</button>
          <button className="btn btn--blank">Settings</button>
          <Link to={`/project/${projectId}`} className="btn" role="button">
            Open
          </Link>
        </div>
      </div>
    </li>
  )
}

ProjectsListItem.propTypes = {
  projectId: PropTypes.string.isRequired,
  project: PropTypes.object.isRequired
}

export default ProjectsListItem
