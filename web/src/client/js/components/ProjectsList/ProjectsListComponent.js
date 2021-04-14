import React from 'react'
import PropTypes from 'prop-types'
import moment from 'moment'

import Table from 'Components/Table/Table'
import ProjectLink from './ProjectLink'
import ProjectTeam from './ProjectTeam'
import ProjectActions from './ProjectActions'

import './_ProjectList.scss'
import './_SpecialProject.scss'

function ProjectsListComponent({
  deleteHandler,
  myProjectsOnly,
  projects,
  specialProject,
  showTeams,
  sortProjectsHandler,
  sortBy,
  sortMethod
}) {
  function handleDelete(projectId) {
    deleteHandler(projectId)
  }

  const tableHeadings = {
    name: { label: 'Project', sortable: true },
    team: { label: showTeams ? 'Team' : '' },
    updatedAt: { label: 'Last modified', sortable: true },
    tools: { label: '' }
  }

  const tableRows = {}

  // Special project should always be first
  if (specialProject && !myProjectsOnly) {
    tableRows[0] = [
      <ProjectLink key={`p-${specialProject.id}`} project={specialProject} special />,
      <ProjectTeam key={`pt-${specialProject.id}`} projectId={specialProject.id} show={specialProject.accessLevel == null} />,
      <span key={`pu-${specialProject.id}`} className="project-list__updated-at">{moment(specialProject.updatedAt).fromNow()}</span>,
      <ProjectActions key={`pa-${specialProject.id}`} handleDelete={() => handleDelete(specialProject.id)} projectId={specialProject.id} />
    ]
  }

  for (let i = 0; i < projects.length; i++) {
    const project = projects[i]
    // const privateProject = project.accessLevel == null
    const projectId = Number(project.id)
    tableRows[i + 1] = [
      <ProjectLink key={`p-${projectId}`} project={project} />,
      <ProjectTeam key={`pt-${projectId}`} projectId={projectId} show={true}/>,
      <span key={`pu-${projectId}`} className="project-list__updated-at">{moment(project.updatedAt).fromNow()}</span>,
      <ProjectActions key={`pa-${projectId}`} handleDelete={() => handleDelete(projectId)} projectId={projectId} />
    ]
  }

  return (
    <Table
      className="project-list"
      headings={tableHeadings}
      rows={tableRows}
      sortCallback={sortProjectsHandler}
      sortedBy={sortBy}
      sortMethod={sortMethod}
    />
  )
}

ProjectsListComponent.propTypes = {
  deleteHandler: PropTypes.func.isRequired,
  sortProjectsHandler: PropTypes.func.isRequired,
  myProjectsOnly: PropTypes.bool.isRequired,
  projects: PropTypes.array.isRequired,
  specialProject: PropTypes.object,
  showTeams: PropTypes.bool.isRequired,
  sortBy: PropTypes.string.isRequired,
  sortMethod: PropTypes.string.isRequired
}

export default ProjectsListComponent
