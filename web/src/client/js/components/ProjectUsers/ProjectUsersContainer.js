import React from 'react'
import PropTypes from 'prop-types'

import dataMapper from 'Libs/dataMapper'
import useDataService from 'Hooks/useDataService'

import ProjectUsersComponent from './ProjectUsersComponent'

const ProjectUsersContainer = ({ projectId, collapsed }) => {
  const { data: users } = useDataService(dataMapper.users.list())
  const { data: projectAssignments } = useDataService(dataMapper.projects.projectAssignments(projectId))
  if (!users || !projectAssignments) return null

  const projectUsers = Object.keys(projectAssignments).map((key) => {
    return users[key]
  })

  return <ProjectUsersComponent collapsed={collapsed} users={projectUsers} />
}

ProjectUsersContainer.propTypes = {
  projectId: PropTypes.string.isRequired,
  collapsed: PropTypes.bool
}

export default ProjectUsersContainer
