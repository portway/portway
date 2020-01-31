import React, { lazy, useRef, useState } from 'react'
import PropTypes from 'prop-types'
import { debounce } from 'lodash'
import { Link } from 'react-router-dom'
const Select = lazy(() => import('react-select'))

import { PATH_PROJECT, PROJECT_ROLE_IDS } from 'Shared/constants'
import { ArrowIcon } from 'Components/Icons'
import ProjectRolesDropdown from 'Components/RolesDropdowns/ProjectRolesDropdown'
import ProjectTeamList from './ProjectTeamList'
import ValidationContainer from 'Components/Validation/ValidationContainer'

import './_ProjectSettingsTeams.scss'

const ProjectSettingsTeamsComponent = ({
  createAssignmentHandler,
  projectId,
  projectUsers,
  removeAssignmentHandler,
  updateAssignmentHandler,
  users,
  userSearchHandler
}) => {
  const selectRef = useRef()
  const [newUserId, setNewUserId] = useState(null)
  const [newUserRole, setNewUserRole] = useState(PROJECT_ROLE_IDS.READER)

  return (
    <form className="project-settings__teams form" onSubmit={(e) => { e.preventDefault() }}>
      <section>
        <Link to={`${PATH_PROJECT}/${projectId}`} className="link link--back"><ArrowIcon direction="left" /> Back to Project</Link>
        <h2>Manage your team</h2>
        <h3>Add a teammate to this project</h3>
        <p>Once you add a team member, choose their role for the project</p>
        <div className="field-container field-container--row field-container--large">
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
                className="btn project-settings__team-submit"
                disabled={newUserId === null}
                onClick={() => {
                  createAssignmentHandler(newUserId, newUserRole)
                  selectRef.current.onChange('', 'clear')
                }}>Add teammate</button>
            </div>
          </div>
        </div>
        <ValidationContainer resource="project" value="userId" />
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
  projectId: PropTypes.number.isRequired,
  projectUsers: PropTypes.array.isRequired,
  removeAssignmentHandler: PropTypes.func.isRequired,
  updateAssignmentHandler: PropTypes.func.isRequired,
  users: PropTypes.array.isRequired,
  userSearchHandler: PropTypes.func.isRequired,
}

export default ProjectSettingsTeamsComponent
