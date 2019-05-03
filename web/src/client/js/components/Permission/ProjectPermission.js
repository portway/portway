import React from 'react'
import PropTypes from 'prop-types'

import useDataService from 'Hooks/useDataService'
import dataMapper from 'Libs/dataMapper'
import { ORGANIZATION_ROLE_IDS, PROJECT_ROLE_IDS } from 'Shared/constants'

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

  const { data: currentUser = {} } = useDataService(dataMapper.users.current())
  const { data: project = {} } = useDataService(dataMapper.projects.id(projectId))
  const { data: userProjectAssignments = {} } = useDataService(dataMapper.users.currentUserProjectAssignments())

  // Look at current user Org perms, Org owners and admins have all project perms
  if ([ORGANIZATION_ROLE_IDS.OWNER, ORGANIZATION_ROLE_IDS.ADMIN].indexOf(currentUser.orgRoleId) > -1) {
    return successRender
  }

  const projectAssignment = userProjectAssignments[projectId]

  // Check the manual project role assignments for the current user
  if (projectAssignment && acceptedRoleIds.indexOf(projectAssignment.roleId) > -1) {
    return successRender
  }

  // Current user doesn't have required org perms and isn't manually assigned necessary role for this project,
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
    case 'write':
      return PROJECT_ROLE_IDS.CONTRIBUTOR
    case 'read':
      return PROJECT_ROLE_IDS.READER
  }
}