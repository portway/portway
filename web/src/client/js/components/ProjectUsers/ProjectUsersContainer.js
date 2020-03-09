import React from 'react'
import PropTypes from 'prop-types'

import { currentUserId } from 'Libs/currentIds'
import dataMapper from 'Libs/dataMapper'
import useDataService from 'Hooks/useDataService'

import ProjectUsersComponent from './ProjectUsersComponent'

const ProjectUsersContainer = ({ projectId, collapsed }) => {
  const { data: projectUsers = {}, loading: projectUsersLoading } = useDataService(dataMapper.projects.projectUsers(projectId))
  if (projectUsersLoading ) return null
  const projectUsersWithoutMe = Object.values(projectUsers).filter(user => user.id !== currentUserId)

  return <ProjectUsersComponent collapsed={collapsed} users={projectUsersWithoutMe} />
}

ProjectUsersContainer.propTypes = {
  projectId: PropTypes.number.isRequired,
  collapsed: PropTypes.bool
}

export default ProjectUsersContainer
