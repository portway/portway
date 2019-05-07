import React from 'react'
import PropTypes from 'prop-types'
import { withRouter } from 'react-router-dom'

import Store from '../../../reducers'
import useDataService from 'Hooks/useDataService'
import dataMapper from 'Libs/dataMapper'

import { createProjectAssignee, updateProjectAssignee, removeProjectAssignee } from 'Actions/project'
import { uiConfirm } from 'Actions/ui'
import ProjectSettingsTeamComponent from './ProjectSettingsTeamsComponent'

const ProjectSettingsTeamContainer = ({ match }) => {
  const { projectId } = match.params
  const { data: users } = useDataService(dataMapper.users.list())
  const { data: currentUser } = useDataService(dataMapper.users.current())
  const { data: projectAssignments } = useDataService(dataMapper.projects.projectAssignments(projectId))

  if (!currentUser || !users || !projectAssignments) return null

  const assignedUsers = Object.values(projectAssignments).map((assignment) => {
    const projectUser = { ...users[assignment.userId] }
    return {
      ...projectUser,
      assignmentId: assignment.id,
      projectRoleId: assignment.roleId
    }
  })

  const unassignedUsers = Object.values(users).filter((user) => {
    if (projectAssignments[user.id]) return
    return user
  })

  const userOptions = unassignedUsers.map((user) => {
    return {
      value: String(user.id),
      label: `${user.firstName} ${user.lastName}`
    }
  })

  function createAssignmentHandler(newUserId, newRoleId) {
    Store.dispatch(createProjectAssignee(projectId, { userId: newUserId, roleId: newRoleId }))
  }

  function updateAssignmentHandler(assignmentId, newRoleId) {
    Store.dispatch(updateProjectAssignee(projectId, assignmentId, { roleId: newRoleId }))
  }

  function removeAssignmentHandler(userId, assignmentId) {
    const name = users[userId].firstName
    const message = <span>Remove <span className="highlight">{name}</span> from this project?</span>
    const confirmedAction = () => { Store.dispatch(removeProjectAssignee(projectId, userId, assignmentId)) }
    const confirmedLabel = `Yes, remove ${name}`
    Store.dispatch(uiConfirm({ message, confirmedAction, confirmedLabel }))
  }

  return (
    <ProjectSettingsTeamComponent
      createAssignmentHandler={createAssignmentHandler}
      projectUsers={assignedUsers}
      removeAssignmentHandler={removeAssignmentHandler}
      updateAssignmentHandler={updateAssignmentHandler}
      users={userOptions} />
  )
}

ProjectSettingsTeamContainer.propTypes = {
  match: PropTypes.object.isRequired
}

export default withRouter(ProjectSettingsTeamContainer)
