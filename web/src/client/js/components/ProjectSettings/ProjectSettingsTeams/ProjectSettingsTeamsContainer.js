import React from 'react'
import PropTypes from 'prop-types'
import { withRouter } from 'react-router-dom'
import { Helmet } from 'react-helmet'

import { PRODUCT_NAME } from 'Shared/constants'
import Store from '../../../reducers'
import useDataService from 'Hooks/useDataService'
import dataMapper from 'Libs/dataMapper'
import currentResource from 'Libs/currentResource'

import { createProjectAssignee, updateProjectAssignee, removeProjectAssignee } from 'Actions/project'
import { uiConfirm } from 'Actions/ui'
import ProjectSettingsTeamComponent from './ProjectSettingsTeamsComponent'

const ProjectSettingsTeamContainer = ({ location }) => {
  const { data: project } = useDataService(currentResource('project', location.pathname), [
    location.pathname
  ])
  const projectId = project.id
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
      label: user.name
    }
  })

  function createAssignmentHandler(newUserId, newRoleId) {
    Store.dispatch(createProjectAssignee(projectId, { userId: newUserId, roleId: newRoleId }))
  }

  function updateAssignmentHandler(assignmentId, newRoleId) {
    Store.dispatch(updateProjectAssignee(projectId, assignmentId, { roleId: newRoleId }))
  }

  function removeAssignmentHandler(userId, assignmentId) {
    const name = users[userId].name
    const message = <span>Remove <span className="highlight">{name}</span> from this project?</span>
    const confirmedAction = () => { Store.dispatch(removeProjectAssignee(projectId, userId, assignmentId)) }
    const confirmedLabel = `Yes, remove ${name}`
    Store.dispatch(uiConfirm({ message, confirmedAction, confirmedLabel }))
  }

  return (
    <>
      <Helmet>
        <title>{project.name}: Team management –– {PRODUCT_NAME}</title>
      </Helmet>
      <ProjectSettingsTeamComponent
        createAssignmentHandler={createAssignmentHandler}
        projectUsers={assignedUsers}
        removeAssignmentHandler={removeAssignmentHandler}
        updateAssignmentHandler={updateAssignmentHandler}
        users={userOptions} />
    </>
  )
}

ProjectSettingsTeamContainer.propTypes = {
  location: PropTypes.object.isRequired,
}

export default withRouter(ProjectSettingsTeamContainer)
