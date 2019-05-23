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

  const { data: project = {}, loading: projectLoading } = useDataService(dataMapper.projects.id(Number(projectId)))
  const { data: userProjectAssignments = {}, loading: assignmentLoading } = useDataService(dataMapper.users.currentUserProjectAssignments())

  // check if either project or assignment loading hasn't been triggered yet, or is currently loading, if so always return null
  if (projectLoading || projectLoading == null) {
    return <>{null}</>
  }
  if (assignmentLoading || assignmentLoading == null) {
    return <>{null}</>
  }

  const projectAssignment = userProjectAssignments[Number(projectId)]

  // Check the manual project role assignments for the current user
  if (acceptedRoleIds.includes(projectAssignment.roleId)) {
    return successRender
  }

  // Current user isn't manually assigned necessary role for this project,
  // check the default access level granted to all users
  const projectRoleId = getRoleIdFromProjectAccessLevel(project.accessLevel)

  if (acceptedRoleIds.includes(projectRoleId)) {
    return successRender
  }


  return rejectRender
}

ProjectPermission.propTypes = {
  children: PropTypes.node.isRequired,
  elseRender: PropTypes.node,
  acceptedRoleIds: PropTypes.array.isRequired,
  projectId: PropTypes.oneOfType([
    PropTypes.string.isRequired,
    PropTypes.number.isRequired
  ])
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
