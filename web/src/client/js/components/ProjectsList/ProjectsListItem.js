import React from 'react'
import PropTypes from 'prop-types'

import { Link } from 'react-router-dom'

const ProjectsListItem = ({ projectId, project }) => {
  return (
    <li>
      <Link to={`/project/${projectId}`}>{project.name}</Link>
    </li>
  )
}

ProjectsListItem.propTypes = {
  projectId: PropTypes.string.isRequired,
  project: PropTypes.object.isRequired
}

export default ProjectsListItem
