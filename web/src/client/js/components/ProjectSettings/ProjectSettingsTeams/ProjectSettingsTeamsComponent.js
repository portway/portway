import React, { useState } from 'react'
import PropTypes from 'prop-types'
import Select from 'react-select'

import Constants from 'Shared/constants'
import ProjectRolesDropdown from './ProjectRolesDropdown'
import ProjectTeamList from './ProjectTeamList'

const ProjectSettingsTeamsComponent = ({ users, createAssignmentHandler, projectUsers, updateAssignmentHandler, removeAssignmentHandler }) => {
  const [newUserId, setNewUserId] = useState()
  const [newUserRole, setNewUserRole] = useState(Constants.ROLE_IDS.READER)

  return (
    <form className="project-settings__team">
      <section>
        <h2>Manage your team</h2>
        <div className="form-field form-field--large">
          <div className="field">
            <h3>Add a teammate to this project</h3>
            <p>Once you add a team member, choose their role for the project</p>
            <div className="field__row project-settings__teammate-field">
              <Select
                classNamePrefix="react-select"
                className="react-select-container"
                options={users}
                onChange={(option) => { setNewUserId(Number(option.value)) }}
                placeholder="Add a person..." />
              <ProjectRolesDropdown defaultValue={newUserRole} onChange={(newRoleId) => { setNewUserRole(newRoleId) }} />
              <button type="button" className="btn" onClick={() => { createAssignmentHandler(newUserId, newUserRole) }}>Add teammate</button>
            </div>
          </div>
        </div>
      </section>
      <section>
        <h2>Project team</h2>
        <div className="form-field form-field--large">
          <div className="field">
            <ProjectTeamList projectUsers={projectUsers} removeAssignmentHandler={removeAssignmentHandler} updateAssignmentHandler={updateAssignmentHandler} />
          </div>
        </div>
      </section>
    </form>
  )
}

ProjectSettingsTeamsComponent.propTypes = {
  createAssignmentHandler: PropTypes.func.isRequired,
  removeAssignmentHandler: PropTypes.func.isRequired,
  updateAssignmentHandler: PropTypes.func.isRequired,
  users: PropTypes.array.isRequired,
  projectUsers: PropTypes.array.isRequired
}

export default ProjectSettingsTeamsComponent
