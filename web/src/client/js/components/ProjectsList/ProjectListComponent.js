import React from 'react'
import PropTypes from 'prop-types'
import moment from 'moment'

import Table from 'Components/Table/Table'
import ProjectLink from './ProjectLink'
import ProjectTeam from './ProjectTeam'
import ProjectActions from './ProjectActions'
import './_ProjectList.scss'

function ProjectsListComponent({ deleteHandler, projects }) {
  const tableHeadings = {
    project: { label: 'Project', sortable: true },
    team: { label: 'Team' },
    updatedAt: { label: 'Last modified', sortable: true },
    tools: { label: '' }
  }

  const tableRows = {}
  Object.values(projects).forEach((project, index) => {
    const privateProject = project.accessLevel == null
    const projectId = Number(project.id)
    function handleDelete(e) {
      e.preventDefault()
      deleteHandler(project.id)
    }
    tableRows[index] = [
      <ProjectLink key={`p-${projectId}`} project={project} />,
      <ProjectTeam key={`pt-${projectId}`} projectId={projectId} show={privateProject} />,
      <span key={`pu-${projectId}`}>{moment(project.updatedAt).fromNow()}</span>,
      <ProjectActions key={`pa-${projectId}`} handleDelete={handleDelete} projectId={projectId} />
    ]
  })

  return (
    <Table
      className="project-list"
      headings={tableHeadings}
      rows={tableRows} />
  )
}

ProjectsListComponent.propTypes = {
  deleteHandler: PropTypes.func.isRequired,
  projects: PropTypes.object.isRequired,
}

export default ProjectsListComponent
