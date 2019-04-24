import React from 'react'
import PropTypes from 'prop-types'

import currentUserId from 'Libs/currentUserId'
import { RemoveIcon } from 'Components/Icons'
import ProjectRolesDropdown from './ProjectRolesDropdown'

const ProjectTeamList = ({ projectUsers, removeAssignmentHandler, updateAssignmentHandler }) => {
  if (!projectUsers) return null
  const projectUserList = projectUsers.map((user, index) => {
    if (!user) return null
    const itsMeMario = user.id === currentUserId
    return (
      <li key={`${user.id}-${index}`} className="field__row project-settings__teammate">
        <span className="project-settings__teammate-name">
          {user.firstName} {user.lastName}
          {itsMeMario && <span className="project-settings__teammate-is-you">You</span>}
        </span>
        <div className="project-settings__teammate-role">
          <ProjectRolesDropdown buttonStyle='blank' disabled={itsMeMario} defaultValue={user.projectRoleId} onChange={(roleId) => { updateAssignmentHandler(user.assignmentId, roleId) }} />
        </div>
        <button disabled={itsMeMario} type="button" className="btn btn--blank btn--with-circular-icon" onClick={() => { removeAssignmentHandler(user.id, user.assignmentId) }}><RemoveIcon width="14" height="14" /></button>
      </li>
    )
  })
  return (
    <ol className="project-settings__team-list">
      {projectUserList}
    </ol>
  )
}

ProjectTeamList.propTypes = {
  projectUsers: PropTypes.array.isRequired,
  removeAssignmentHandler: PropTypes.func.isRequired,
  updateAssignmentHandler: PropTypes.func.isRequired
}

export default ProjectTeamList
