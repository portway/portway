import React, { lazy, useRef, useState } from 'react'
import PropTypes from 'prop-types'
const Select = lazy(() => import('react-select'))
import { debounce } from 'lodash'

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
    <form className="project-settings__teams" onSubmit={(e) => { e.preventDefault() }}>
      <section>
        <h2>Manage your team</h2>
        <h3>Add a teammate to this project</h3>
        <p>Once you add a team member, choose their role for the project</p>
        <div className="field-container field-container--row">
          <div className="field">
            <label htmlFor="team-list">Select a team member</label>
            <div className="field__control project-settings__teammate-field">
              <Select
                classNamePrefix="react-select"
                className="react-select-container"
                defaultValue={newUserId}
                inputId="team-list"
                onInputChange={debounce((input, { action }) => {
                  if (action === 'input-change') {
                    setNewUserId(null)
                    userSearchHandler(input)
                  }
                }, 400)}
                options={users}
                onChange={(option) => { setNewUserId(Number(option.value)) }}
                placeholder="Add a person..."
                ref={selectRef} />
            </div>
          </div>
          <div className="field">
            <div className="field__label">Select a role</div>
            <div className="field__control">
              <ProjectRolesDropdown align="right" defaultValue={newUserRole} onChange={(newRoleId) => { setNewUserRole(newRoleId) }} />
            </div>
          </div>
          <div className="field">
            <div className="field__control">
              <button
                type="button"
                className="btn"
                disabled={newUserId === null}
                onClick={() => {
                  createAssignmentHandler(newUserId, newUserRole)
                  selectRef.current.onChange('', 'clear')
                }}>Add teammate</button>
            </div>
          </div>
          <ValidationContainer resource="project" value="userId" />
        </div>
      </section>
      <section>
        <h2>Project team</h2>
        <ProjectTeamList projectUsers={projectUsers} removeAssignmentHandler={removeAssignmentHandler} updateAssignmentHandler={updateAssignmentHandler} />
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
