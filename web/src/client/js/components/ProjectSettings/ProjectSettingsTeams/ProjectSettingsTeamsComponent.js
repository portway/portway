import React, { lazy, useRef, useState } from 'react'
import PropTypes from 'prop-types'
import { debounce } from 'lodash'
import { Link } from 'react-router-dom'
const Select = lazy(() => import('react-select'))

import { PATH_USERS, PATH_PROJECT, PROJECT_ROLE_IDS, ORGANIZATION_ROLE_IDS } from 'Shared/constants'
import { AddIcon, ArrowIcon } from 'Components/Icons'
import OrgPermission from 'Components/Permission/OrgPermission'
import ProjectRolesDropdown from 'Components/RolesDropdowns/ProjectRolesDropdown'
import ProjectTeamList from './ProjectTeamList'
import ValidationContainer from 'Components/Validation/ValidationContainer'

import './_ProjectSettingsTeams.scss'
import { IconButton } from 'Components/Buttons/index'

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
  const showAddUsersMessage = users.length === 0

  return (
    <form className="project-settings__teams form" onSubmit={(e) => { e.preventDefault() }}>
      <section>
        <Link to={`${PATH_PROJECT}/${projectId}`} className="link link--back"><ArrowIcon direction="left" /> Back to Project</Link>
        <h2>Manage your team</h2>
        <h3>Add a teammate to this project</h3>
        <div className="grid grid--teams-list">
          <div className="field">
            <label htmlFor="team-list">Team member</label>
            <div className="field__control project-settings__teammate-field">
              <Select
                classNamePrefix="react-select"
                className="react-select-container"
                defaultValue={newUserId}
                inputId="team-list"
                isClearable={true}
                onInputChange={debounce((input, { action }) => {
                  if (action === 'input-change') {
                    setNewUserId(null)
                    userSearchHandler(input)
                  }
                  if (action === 'menu-close') {
                    userSearchHandler('')
                  }
                }, 400)}
                options={users}
                onChange={(option) => {
                  option && option.value ? setNewUserId(Number(option.value)) : setNewUserId(null)
                }}
                placeholder="Add a person..."
                ref={selectRef} />
            </div>
          </div>
          <div className="field">
            <div className="field__label">Role</div>
            <div className="field__control">
              <ProjectRolesDropdown
                align="right"
                className="project-settings__team-role-selector"
                defaultValue={newUserRole}
                onChange={(newRoleId) => { setNewUserRole(newRoleId) }}
              />
            </div>
          </div>
          <div className="field">
            <div className="field__control">
              <button
                type="button"
                className="btn project-settings__teams-btn project-settings__team-submit"
                disabled={newUserId === null}
                onClick={() => {
                  createAssignmentHandler(newUserId, newUserRole)
                  selectRef.current.onChange('', 'clear')
                }}
              >
                Add teammate
              </button>
              <IconButton
                className="project-settings__team-submit"
                disabled={newUserId === null}
                color="green"
                onClick={() => {
                  createAssignmentHandler(newUserId, newUserRole)
                  selectRef.current.onChange('', 'clear')
                }}
              >
                <AddIcon />
              </IconButton>
            </div>
          </div>
        </div>
        <OrgPermission acceptedRoleIds={[ORGANIZATION_ROLE_IDS.ADMIN, ORGANIZATION_ROLE_IDS.OWNER]}>
          {showAddUsersMessage &&
          <p className="project-settings__users-warning note">
            It looks like you haven’t added users to your organization yet. Once you <Link to={PATH_USERS}>add users</Link>,
            you can assign them to project teams.
          </p>
          }
        </OrgPermission>
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
