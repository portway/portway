import React from 'react'
import PropTypes from 'prop-types'

import ProjectsListItem from './ProjectsListItem'
import './ProjectList.scss'

function ProjectsListComponent({ projects }) {
  const projectList = Object.keys(projects).map((projectId) => {
    return <ProjectsListItem key={projectId} projectId={projectId} project={projects[projectId]} />
  })

  return (
    <ol className="project-list">{projectList}</ol>
  )
}

ProjectsListComponent.propTypes = {
  projects: PropTypes.object.isRequired
}

export default ProjectsListComponent
