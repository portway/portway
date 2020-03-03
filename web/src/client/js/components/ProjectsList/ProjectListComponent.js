import React from 'react'
import PropTypes from 'prop-types'

import ProjectsListItem from './ProjectsListItem'
import './_ProjectList.scss'

function ProjectsListComponent({ deleteHandler, projects }) {
  const projectList = Object.keys(projects).map((projectId) => {
    return <ProjectsListItem
      key={projectId}
      projectId={Number(projectId)}
      project={projects[projectId]}
      handleDelete={(e) => {
        e.preventDefault()
        deleteHandler(projectId)
      }} />
  })

  return (
    <ol className="project-list">
      {projectList}
    </ol>
  )
}

ProjectsListComponent.propTypes = {
  deleteHandler: PropTypes.func.isRequired,
  projects: PropTypes.object.isRequired,
}

export default ProjectsListComponent
