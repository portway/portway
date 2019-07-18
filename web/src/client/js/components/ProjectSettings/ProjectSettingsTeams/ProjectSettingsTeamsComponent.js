import React, { useRef, useState } from 'react'
import PropTypes from 'prop-types'
import Select from 'react-select'

import Constants from 'Shared/constants'
import ProjectRolesDropdown from 'Components/RolesDropdowns/ProjectRolesDropdown'
import ProjectTeamList from './ProjectTeamList'
import ValidationContainer from 'Components/Validation/ValidationContainer'

import './_ProjectSettingsTeams.scss'

const ProjectSettingsTeamsComponent = ({ users, createAssignmentHandler, projectUsers, updateAssignmentHandler, removeAssignmentHandler, userSearchHandler }) => {
  const selectRef = useRef()
  const [newUserId, setNewUserId] = useState(null)
  const [newUserRole, setNewUserRole] = useState(Constants.PROJECT_ROLE_IDS.READER)

  return (
    <form className="project-settings__team" onSubmit={(e) => { e.preventDefault() }}>
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
                onInputChange={(input, action) => { userSearchHandler(input) }}
                options={users}
                onChange={(option) => { setNewUserId(Number(option.value)) }}
                placeholder="Add a person..."
                ref={selectRef} />
              <ProjectRolesDropdown align="right" defaultValue={newUserRole} onChange={(newRoleId) => { setNewUserRole(newRoleId) }} />
              <button
                type="button"
                className="btn"
                disabled={newUserId === null}
                onClick={() => {
                  createAssignmentHandler(newUserId, newUserRole)
                  selectRef.current.onChange('', 'clear')
                }}>Add teammate</button>
            </div>
            <ValidationContainer resource="project" value="userId" />
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
  userSearchHandler: PropTypes.func.isRequired,
  users: PropTypes.array.isRequired,
  projectUsers: PropTypes.array.isRequired
}

export default ProjectSettingsTeamsComponent
