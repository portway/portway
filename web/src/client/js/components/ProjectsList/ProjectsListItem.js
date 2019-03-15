import React from 'react'
import PropTypes from 'prop-types'

import { Link } from 'react-router-dom'

const ProjectsListItem = ({ projectId, project }) => {
  return (
    <li>
      <div className="project-list__item" role="menu" tabIndex="0">
        <div className="project-list__info">
          <span className="icon icon-project" />
          <h3 className="project-list__title">{project.name}</h3>
          <p className="project-list__item-meta">Last updated by _USER_</p>
        </div>
        <div className="project-list__actions">
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
