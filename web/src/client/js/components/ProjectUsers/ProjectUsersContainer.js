import React from 'react'
import PropTypes from 'prop-types'

import { currentUserId } from 'Libs/currentIds'
import dataMapper from 'Libs/dataMapper'
import useDataService from 'Hooks/useDataService'

import ProjectUsersComponent from './ProjectUsersComponent'

const ProjectUsersContainer = ({ projectId, collapsed }) => {
  const { data: users = {}, loading: usersLoading } = useDataService(dataMapper.users.list(1))
  const { data: projectAssignments = {}, loading: assignmentLoading } = useDataService(dataMapper.projects.projectAssignments(projectId))
  if (usersLoading || users === {}) return null
  if (assignmentLoading || projectAssignments === {}) return null

  const projectUsers = Object.keys(projectAssignments).map((assignmentKey) => { return users[assignmentKey] })
  const projectUsersWithoutMe = projectUsers.filter(user => user.id !== currentUserId)

  return <ProjectUsersComponent collapsed={collapsed} users={projectUsersWithoutMe} />
}

ProjectUsersContainer.propTypes = {
  projectId: PropTypes.string.isRequired,
  collapsed: PropTypes.bool
}

export default ProjectUsersContainer
