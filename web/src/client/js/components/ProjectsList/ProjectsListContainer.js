import React from 'react'

import dataMapper from '../../libs/dataMapper'
import useDataService from '../../hooks/useDataService'

import ProjectsListItem from './ProjectsListItem'

function ProjectsListContainer(props) {
  const projects = useDataService(dataMapper.projects.list())

  const projectList = Object.keys(projects).map((projectId) => {
    return <ProjectsListItem key={projectId} projectId={projectId} project={projects[projectId]} />
  })

  return (
    <div>
      <ol>{projectList}</ol>
    </div>
  )
}

export default ProjectsListContainer
