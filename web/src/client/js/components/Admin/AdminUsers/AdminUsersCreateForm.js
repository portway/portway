import React, { useState } from 'react'
import PropTypes from 'prop-types'
import Select from 'react-select'

import { debounce } from 'Shared/utilities'
import { ORGANIZATION_ROLE_IDS, ORGANIZATION_ROLE_NAMES } from 'Shared/constants'
import SpinnerContainer from 'Components/Spinner/SpinnerContainer'
import TextField from 'Components/Form/TextField'
import ValidationComponent from 'Components/Validation/ValidationComponent'

const AdminUsersCreateForm = ({ cancelHandler, errors, submitHandler }) => {
  const [name, setName] = useState()
  const [email, setEmail] = useState()
  const [orgRole, setOrgRole] = useState(ORGANIZATION_ROLE_IDS.USER)

  function formSubmitHandler(e) {
    e.preventDefault()
    submitHandler({ name, email, orgRole })
  }

  const orgSelectObject = [
    { value: ORGANIZATION_ROLE_IDS.USER, label: ORGANIZATION_ROLE_NAMES[ORGANIZATION_ROLE_IDS.USER] },
    { value: ORGANIZATION_ROLE_IDS.ADMIN, label: ORGANIZATION_ROLE_NAMES[ORGANIZATION_ROLE_IDS.ADMIN] }
  ]

  function isNameOrEmailBlank() {
    return name === undefined || email === undefined
  }

  return (
    <form onSubmit={formSubmitHandler}>
      <section>
        <h2>Add a User</h2>
        <TextField
          errors={errors.name}
          id="userName"
          label="Full name"
          name="name"
          onChange={(e) => debounce(200, setName(e.target.value))}
          onBlur={(e) => { setName(e.target.value)} }
          placeholder="Enter a full name"
          required
        />
        <TextField
          errors={errors.email}
          id="userEmail"
          label="Email address"
          name="email"
          onChange={(e) => debounce(200, setEmail(e.target.value))}
          onBlur={(e) => { setEmail(e.target.value)} }
          placeholder="name@domain.com"
          required
          type="email"
        />
        <div className="form-field">
          <div className="field">
            <label htmlFor="orgRole">Select a Role</label>
            <div className="control">
              <Select
                className="react-select-container react-select-container--with-indicators"
                classNamePrefix="react-select"
                name="orgRole"
                isSearchable={false}
                onChange={(option) => { setOrgRole(option.value) }}
                options={orgSelectObject}
                defaultValue={orgSelectObject[0]}
              />
              <ValidationComponent errors={errors.orgRole} />
            </div>
          </div>
        </div>
      </section>

      <div className="btn-group">
        <button className="btn btn-primary" disabled={isNameOrEmailBlank()}>Add User <SpinnerContainer color="#ffffff" /></button>
        <button type="button" className="btn btn--blank" onClick={cancelHandler}>Cancel</button>
      </div>
    </form>
  )
}

AdminUsersCreateForm.propTypes = {
  cancelHandler: PropTypes.func.isRequired,
  errors: PropTypes.object,
  submitHandler: PropTypes.func.isRequired
}

AdminUsersCreateForm.defaultProps = {
  user: {},
  errors: {}
}

export default AdminUsersCreateForm
