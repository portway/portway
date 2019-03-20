import React from 'react'
import PropTypes from 'prop-types'

import './Project.scss'

function ProjectComponent({ project }) {
  return (
    <div className="project">
      <header className="project__details">
        <h2 className="header--with-icon">
          <span className="icon icon-project" /> {project.name}
        </h2>
        <div className="project__expand h-sixth-level">
          <div className="project__expand--details">
            <span className="icon icon-caret-up" /> Show Less
          </div>
        </div>
      </header>
    </div>
  )
}

ProjectComponent.propTypes = {
  project: PropTypes.object.isRequired
}

export default ProjectComponent
