import React from 'react'
import PropTypes from 'prop-types'

import { currentUserId } from 'Libs/currentIds'
import { UserIcon, RemoveIcon } from 'Components/Icons'
import ProjectRolesDropdown from 'Components/RolesDropdowns/ProjectRolesDropdown'
import { IconButton } from 'Components/Buttons/index'

const ProjectTeamList = ({ projectUsers, removeAssignmentHandler, updateAssignmentHandler }) => {
  if (!projectUsers) return null
  const projectUserList = projectUsers.map((user, index) => {
    if (!user) return null
    const itsMeMario = user.id === currentUserId
    return (
      <li key={`${user.id}-${index}`} className="project-settings__teammate">
        <div className="grid grid--teams-list">
          <div className="field">
            <div className="field__control">
              <UserIcon width="24" height="24" />
              <span className="project-settings__teammate-name">{user.name}</span>
              {itsMeMario && <span className="project-settings__teammate-is-you pill pill--highlight">You</span>}
            </div>
          </div>
          {/* /field */}
          <div className="field">
            <div className="field__control">
              <ProjectRolesDropdown
                align="right"
                className="project-settings__team-role-selector"
                disabled={itsMeMario}
                defaultValue={user.projectRoleId}
                onChange={(roleId) => { updateAssignmentHandler(user.assignmentId, roleId) }}
              />
            </div>
          </div>
          {/* /field */}
          <div className="field">
            <div className="field__control">
              <button
                aria-label={`Remove ${user.name} from this project`}
                className="btn btn--white btn--danger project-settings__teams-btn"
                disabled={itsMeMario}
                onClick={() => { removeAssignmentHandler(user.id, user.assignmentId) }}
              >
                Remove teammate
              </button>
              <IconButton
                aria-label={`Remove ${user.name} from this project`}
                disabled={itsMeMario}
                onClick={() => { removeAssignmentHandler(user.id, user.assignmentId) }}
              >
                <RemoveIcon />
              </IconButton>
            </div>
          </div>
          {/* /field */}
        </div>
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
