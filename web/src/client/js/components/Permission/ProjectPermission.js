import React from 'react'
import PropTypes from 'prop-types'

import useDataService from 'Hooks/useDataService'
import dataMapper from 'Libs/dataMapper'
import { PROJECT_ROLE_IDS, PROJECT_ACCESS_LEVELS } from 'Shared/constants'

const ProjectPermission = ({ children, elseRender, acceptedRoleIds, projectId }) => {
  const rejectRender = (
    <>
      {elseRender || null}
    </>
  )
  const successRender = (
    <>
      {children}
    </>
  )

  const { data: project = {} } = useDataService(dataMapper.projects.id(projectId))
  const { data: userProjectAssignments = {} } = useDataService(dataMapper.users.currentUserProjectAssignments())

  const projectAssignment = userProjectAssignments[projectId]

  // Check the manual project role assignments for the current user
  if (projectAssignment && acceptedRoleIds.indexOf(projectAssignment.roleId) > -1) {
    return successRender
  }

  // Current user isn't manually assigned necessary role for this project,
  // check the default access level granted to all users
  const projectRoleId = getRoleIdFromProjectAccessLevel(project.accessLevel)

  if (projectRoleId && acceptedRoleIds.indexOf(projectRoleId) > -1) {
    return successRender
  }

  return rejectRender
}

ProjectPermission.propTypes = {
  children: PropTypes.node.isRequired,
  elseRender: PropTypes.node,
  acceptedRoleIds: PropTypes.array.isRequired,
  projectId: PropTypes.number.isRequired
}

export default ProjectPermission

const getRoleIdFromProjectAccessLevel = function(accessLevel) {
  switch (accessLevel) {
    case PROJECT_ACCESS_LEVELS.WRITE:
      return PROJECT_ROLE_IDS.CONTRIBUTOR
    case PROJECT_ACCESS_LEVELS.READ:
      return PROJECT_ROLE_IDS.READER
  }
}
