import React, { useEffect, useRef, useState } from 'react'
import PropTypes from 'prop-types'

import Constants from 'Shared/constants'
import ProjectRolesDropdown from 'Components/RolesDropdowns/ProjectRolesDropdown'
import ValidationContainer from 'Components/Validation/ValidationContainer'

const ProjectSettingsCreateToken = ({ cancelHandler, createHandler, errors, projectId }) => {
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
      <div className="field-container">
        <div className="field">
          <label htmlFor="token-name">Key name <span className="note">(required)</span></label>
          <div className="field__control">
            <input ref={nameRef} type="text" name="token-name" placeholder="Key name..." onChange={nameChangeHandler} />
          </div>
          <ValidationContainer resource="project" value="name" />
        </div>
        <p className="field-container__help">Use the key name to help you differentiate between your project keys.</p>
      </div>
      <div className="field-container">
        <div className="field">
          <label htmlFor="role-menu">Select a role</label>
          <ProjectRolesDropdown defaultValue={Constants.PROJECT_ROLE_IDS.READER} name="role-menu" onChange={(roleId) => { setProjectRoleId(roleId) }} />
        </div>
      </div>
      <div className="field-container field-container--row field-container--with-space">
        <div className="field">
          <button className="btn btn--primary" disabled={creationDisabled}>Create key</button>
        </div>
        <div className="field">
          <button type="button" className="btn btn--blank" onClick={cancelHandler}>Cancel</button>
        </div>
      </div>
    </form>
  )
}

ProjectSettingsCreateToken.propTypes = {
  cancelHandler: PropTypes.func.isRequired,
  createHandler: PropTypes.func.isRequired,
  errors: PropTypes.array,
  projectId: PropTypes.number.isRequired
}

export default ProjectSettingsCreateToken
