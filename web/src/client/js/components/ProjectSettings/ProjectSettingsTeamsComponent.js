import React, { useState } from 'react'
import PropTypes from 'prop-types'
import Select from 'react-select'

import { CaretIcon, RemoveIcon } from 'Components/Icons'
import DropdownComponent from 'Components/Dropdown/DropdownComponent'

const ProjectSettingsTeamsComponent = ({ project, users, currentUser, onUpdateHandler }) => {
  const [permissionMenuLabel, setPermissionMenuLabel] = useState('Reader')
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
              <DropdownComponent align="right" button={roleSelectorButton} className="project-settings__teammate-menu">
                <li className="menu__item">
                  <button type="button" className="btn btn--blank" onClick={() => { setPermissionMenuLabel('Reader') }}>
                    <b className="small">Reader</b>
                    <p className="small">Project Readers can view all of the documents in this project, but that is all.</p>
                  </button>
                </li>
                <li>
                  <button type="button" className="btn btn--blank" onClick={() => { setPermissionMenuLabel('Contributor') }}>
                    <b className="small">Contributor</b>
                    <p className="small">Project Contributors can create, edit, publish, and delete documents within this project. They can also view API data.</p>
                  </button>
                </li>
                <li>
                  <button type="button" className="btn btn--blank" onClick={() => { setPermissionMenuLabel('Admin') }}>
                    <b className="small">Admin</b>
                    <p className="small">Project Admins can manage everything within a project – this includes project access, project deletion, etc.</p>
                  </button>
                </li>
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
