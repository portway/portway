import React from 'react'
import PropTypes from 'prop-types'
import moment from 'moment'

import Table from 'Components/Table/Table'
import ProjectLink from './ProjectLink'
import ProjectTeam from './ProjectTeam'
import ProjectActions from './ProjectActions'

import './_ProjectList.scss'
import './_SpecialProject.scss'

function ProjectListComponent({ deleteHandler, sortProjectsHandler, projects, specialProject, showTeams, sortBy, sortMethod }) {
  function handleDelete(projectId) {
    deleteHandler(projectId)
  }

  const tableHeadings = {
    project: { label: 'Project', sortable: true },
    team: { label: showTeams ? 'Team' : '' },
    updatedAt: { label: 'Last modified', sortable: true },
    tools: { label: '' }
  }

  const tableRows = {}

  // Special project should always be first
  if (specialProject) {
    tableRows[0] = [
      <ProjectLink key={`p-${specialProject.id}`} project={specialProject} special />,
      <ProjectTeam key={`pt-${specialProject.id}`} projectId={specialProject.id} show={specialProject.accessLevel == null} />,
      <span key={`pu-${specialProject.id}`} className="project-list__updated-at">{moment(specialProject.updatedAt).fromNow()}</span>,
      <ProjectActions key={`pa-${specialProject.id}`} handleDelete={() => handleDelete(specialProject.id)} projectId={specialProject.id} />
    ]
  }

  for (let i = 0; i < Object.values(projects).length; i++) {
    const project = Object.values(projects)[i]
    const privateProject = project.accessLevel == null
    const projectId = Number(project.id)
    tableRows[i + 1] = [
      <ProjectLink key={`p-${projectId}`} project={project} />,
      <ProjectTeam key={`pt-${projectId}`} projectId={projectId} show={privateProject} />,
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

ProjectListComponent.propTypes = {
  deleteHandler: PropTypes.func.isRequired,
  sortProjectsHandler: PropTypes.func.isRequired,
  projects: PropTypes.object.isRequired,
  specialProject: PropTypes.object,
  showTeams: PropTypes.bool.isRequired,
  sortBy: PropTypes.string.isRequired,
  sortMethod: PropTypes.string.isRequired
}

export default ProjectListComponent
