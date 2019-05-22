import React from 'react'
import PropTypes from 'prop-types'
import { Link } from 'react-router-dom'

import { PATH_PROJECT } from 'Shared/constants'

import './SimpleProjectList.scss'

const SimpleProjectListComponent = ({ projects }) => {
  function renderProjectItem() {
    return projects.map((project) => {
      return (
        <Link className="simple-project-list__item" to={`${PATH_PROJECT}/${project.id}`} key={project.id}>
          {project.name}
        </Link>
      )
    })
  }

  return (
    <ol className="simple-project-list">
      {renderProjectItem()}
    </ol>
  )
}

SimpleProjectListComponent.propTypes = {
  projects: PropTypes.array.isRequired
}

export default SimpleProjectListComponent
