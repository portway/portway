import React, { useState } from 'react'
import PropTypes from 'prop-types'
import Select from 'react-select'

import Constants from 'Shared/constants'
import { CaretIcon, RemoveIcon } from 'Components/Icons'
import { DropdownComponent, DropdownItem } from 'Components/Dropdown/Dropdown'

const ProjectSettingsTeamsComponent = ({ project, users, currentUser, onUpdateHandler }) => {
  const [permissionMenuLabel, setPermissionMenuLabel] = useState(Constants.ROLE_NAMES.READ)
  if (!project) return null
  const usersWithoutMe = Object.values(users).filter(user => user.id !== currentUser.id)
  const userOptions = usersWithoutMe.map((user) => {
    return {
      value: String(user.id),
      label: `${user.firstName} ${user.lastName}`
    }
  })
  const roleSelectorButton = {
    label: permissionMenuLabel, // role name?
    className: 'btn--white btn--with-icon',
    icon: <CaretIcon width="14" height="14" />
  }
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
                options={userOptions}
                placeholder="Add a person..." />
              <DropdownComponent align="right" autoCollapse={true} button={roleSelectorButton} className="project-settings__teammate-menu">
                <DropdownItem label={Constants.ROLE_NAMES.READ} onClick={() => setPermissionMenuLabel(Constants.ROLE_NAMES.READ) }>
                  <p className="small">Project Readers can view all of the documents in this project, but that is all.</p>
                </DropdownItem>
                <DropdownItem label={Constants.ROLE_NAMES.WRITE} onClick={() => setPermissionMenuLabel(Constants.ROLE_NAMES.WRITE) }>
                  <p className="small">Project Contributors can create, edit, publish, and delete documents within this project. They can also view API data.</p>
                </DropdownItem>
                <DropdownItem label={Constants.ROLE_NAMES.ADMIN} onClick={() => setPermissionMenuLabel(Constants.ROLE_NAMES.ADMIN) }>
                  <p className="small">Project Contributors can create, edit, publish, and delete documents within this project. They can also view API data.</p>
                </DropdownItem>
              </DropdownComponent>
              <button className="btn">Add teammate</button>
            </div>
          </div>
        </div>
      </section>
      <section>
        <h2>Project team</h2>
        <div className="form-field form-field--large">
          <div className="field">
            <ol className="project-settings__team-list">
              <li className="field__row project-settings__teammate">
                <span className="project-settings__teammate-name">Dirk Heniges</span>
                <button type="button" className="btn btn--white btn--with-icon">Contributor <CaretIcon width="14" height="14" /></button>
                <button type="button" className="btn btn--blank btn--with-circular-icon"><RemoveIcon width="14" height="14" /></button>
              </li>
            </ol>
          </div>
        </div>
      </section>
    </form>
  )
}

ProjectSettingsTeamsComponent.propTypes = {
  currentUser: PropTypes.object.isRequired,
  project: PropTypes.object.isRequired,
  onUpdateHandler: PropTypes.func.isRequired,
  users: PropTypes.object.isRequired
}

export default ProjectSettingsTeamsComponent
