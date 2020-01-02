import React from 'react'
import PropTypes from 'prop-types'

import { currentUserId } from 'Libs/currentIds'
import { RemoveIcon, UserIcon } from 'Components/Icons'
import ProjectRolesDropdown from 'Components/RolesDropdowns/ProjectRolesDropdown'

const ProjectTeamList = ({ projectUsers, removeAssignmentHandler, updateAssignmentHandler }) => {
  if (!projectUsers) return null
  const projectUserList = projectUsers.map((user, index) => {
    if (!user) return null
    const itsMeMario = user.id === currentUserId
    return (
      <li key={`${user.id}-${index}`} className="project-settings__teammate">
        <span className="project-settings__teammate-name">
          <UserIcon />
          {user.name}
          {itsMeMario && <span className="project-settings__teammate-is-you pill pill--highlight">You</span>}
        </span>
        <div className="project-settings__teammate-role">
          <ProjectRolesDropdown
            align="right"
            disabled={itsMeMario}
            defaultValue={user.projectRoleId}
            onChange={(roleId) => { updateAssignmentHandler(user.assignmentId, roleId) }}
          />
        </div>
        <button
          aria-label={`Remove ${user.name} from this project`}
          className="btn btn--blank btn--with-circular-icon"
          disabled={itsMeMario}
          onClick={() => { removeAssignmentHandler(user.id, user.assignmentId) }}
          type="button"
        >
          <RemoveIcon />
        </button>
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
