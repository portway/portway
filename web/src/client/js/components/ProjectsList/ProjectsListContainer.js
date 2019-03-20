import React from 'react'

import dataMapper from '../../libs/dataMapper'
import useDataService from '../../hooks/useDataService'

import ProjectsListComponent from './ProjectListComponent'

function ProjectsListContainer() {
  const { data: projects } = useDataService(dataMapper.projects.list())
  return (
    <div className="project-list-container">
      <ProjectsListComponent projects={projects} />
    </div>
  )
}

export default ProjectsListContainer
