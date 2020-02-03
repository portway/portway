import React, { useState } from 'react'
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
  const [userSearch, setUserSearch] = useState()

  const { data: project = {} } = useDataService(currentResource('project', location.pathname), [
    location.pathname
  ])

  const projectId = project.id
  const { data: projectUsers } = useDataService(dataMapper.projects.projectUsers(projectId))
  const { data: currentUser } = useDataService(dataMapper.users.current())
  const { data: projectAssignments } = useDataService(dataMapper.projects.projectAssignments(projectId))
  const { data: loadedUsers } = useDataService(dataMapper.users.list(1))
  const { data: searchUsers = {} } = useDataService(dataMapper.users.searchByName(userSearch), [userSearch])

  if (!currentUser || !projectUsers || !projectAssignments || !Object.keys(project).length) return null

  const assignedUsers = Object.values(projectAssignments).map((assignment) => {
    const projectUser = { ...projectUsers[assignment.userId] }
    return {
      ...projectUser,
      assignmentId: assignment.id,
      projectRoleId: assignment.roleId
    }
  })

  let unassignedUsers = []

  const searchResults = searchUsers && searchUsers.userSearchResults
  const resultsOrLoadedUsers = userSearch ? searchResults : loadedUsers.users
  if (resultsOrLoadedUsers) {
    unassignedUsers = Object.values(resultsOrLoadedUsers).filter((user) => {
      if (projectAssignments[user.id]) return
      return user
    })
  }

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
    const name = projectUsers[userId].name
    const message = <span>Remove <span className="highlight">{name}</span> from this project?</span>
    const confirmedAction = () => { Store.dispatch(removeProjectAssignee(projectId, userId, assignmentId)) }
    const confirmedLabel = `Yes, remove ${name}`
    Store.dispatch(uiConfirm({ message, confirmedAction, confirmedLabel }))
  }

  function userSearchHandler(partialNameString) {
    setUserSearch(partialNameString)
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
        userSearchHandler={userSearchHandler}
        users={userOptions}
        projectId={projectId} />
    </>
  )
}

ProjectSettingsTeamContainer.propTypes = {
  location: PropTypes.object.isRequired,
}

export default withRouter(ProjectSettingsTeamContainer)
