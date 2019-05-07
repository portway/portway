import React, { useEffect, useRef, useState } from 'react'
import PropTypes from 'prop-types'

import Constants from 'Shared/constants'
import ProjectRolesDropdown from 'Components/ProjectRoles/ProjectRolesDropdown'

const ProjectSettingsCreateToken = ({ cancelHandler, createHandler, projectId }) => {
  const [projectRoleId, setProjectRoleId] = useState(Constants.PROJECT_ROLE_IDS.READER)
  const [creationDisabled, setCreationDisabled] = useState(true)
  const nameRef = useRef()
  function createKeyHandler() {
    createHandler(projectId, projectRoleId, nameRef.current.value)
  }
  function nameChangeHandler() {
    if (nameRef.current.value !== '') {
      setCreationDisabled(false)
    }
  }
  useEffect(() => {
    nameRef.current.focus()
  }, [])
  return (
    <form className="project-settings__create-token" onSubmit={(e) => { e.preventDefault(); createKeyHandler() }}>
      <div className="form-field">
        <div className="field">
          <label htmlFor="token-name">Key name <span className="note">(required)</span></label>
          <input ref={nameRef} type="text" name="token-name" placeholder="Key name..." onChange={nameChangeHandler} />
          <p className="note">The name is not important. Use it as a way to identify your differeny keys.</p>
        </div>
      </div>
      <div className="form-field">
        <div className="field">
          <label htmlFor="role-menu">Select a role</label>
          <ProjectRolesDropdown defaultValue={Constants.PROJECT_ROLE_IDS.READER} name="role-menu" onChange={(roleId) => { setProjectRoleId(roleId) }} />
        </div>
      </div>
      <div className="form-field">
        <div className="field__row field--with-space">
          <button className="btn btn--primary" disabled={creationDisabled}>Create key</button>
          <button type="button" className="btn btn--blank" onClick={cancelHandler}>Cancel</button>
        </div>
      </div>
    </form>
  )
}

ProjectSettingsCreateToken.propTypes = {
  cancelHandler: PropTypes.func.isRequired,
  createHandler: PropTypes.func.isRequired,
  projectId: PropTypes.string.isRequired
}

export default ProjectSettingsCreateToken
