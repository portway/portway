import React, { useState } from 'react'
import PropTypes from 'prop-types'

import { debounce } from 'Shared/utilities'
import { ORGANIZATION_ROLE_IDS } from 'Shared/constants'
import SpinnerContainer from 'Components/Spinner/SpinnerContainer'
import FormField from 'Components/Form/FormField'
import OrgRolesDropdown from 'Components/RolesDropdowns/OrgRolesDropdown'
import ValidationComponent from 'Components/Validation/ValidationComponent'

const AdminUsersCreateForm = ({ cancelHandler, disabled, errors, submitHandler }) => {
  const [name, setName] = useState()
  const [email, setEmail] = useState()
  const [orgRole, setOrgRole] = useState(ORGANIZATION_ROLE_IDS.USER)

  const borderColor = getComputedStyle(document.documentElement).getPropertyValue('--theme-border')

  function formSubmitHandler(e) {
    e.preventDefault()
    submitHandler({ name, email, orgRole })
  }

  function isNameOrEmailBlank() {
    return name === undefined || email === undefined || disabled
  }

  return (
    <form onSubmit={formSubmitHandler}>
      <section>
        <h2>Add a User</h2>
        <FormField
          errors={errors.name}
          id="userName"
          label="Full name"
          name="name"
          onChange={(e) => {
            if (e.target.value.length > 1) {
              debounce(200, setName(e.target.value))
            }
          }}
          onBlur={(e) => {
            if (e.target.value.length > 1) {
              setName(e.target.value)
            }
          }}
          placeholder="Enter a full name"
          required
        />
        <FormField
          errors={errors.email}
          id="userEmail"
          label="Email address"
          name="email"
          onChange={(e) => {
            if (e.target.value.length > 1) {
              debounce(200, setEmail(e.target.value))
            }
          }}
          onBlur={(e) => {
            if (e.target.value.length > 1) {
              setEmail(e.target.value)
            }
          }}
          placeholder="name@domain.com"
          required
          type="email"
        />
        <div className="field-container">
          <div className="field">
            <label htmlFor="orgRole">Select a Role</label>
            <div className="control">
              <OrgRolesDropdown
                defaultValue={orgRole}
                onChange={(roleId) => { setOrgRole(roleId) }}
              />
              <ValidationComponent errors={errors.orgRole} />
            </div>
          </div>
        </div>
      </section>

      <div className="btn-group">
        <button className="btn btn-primary" disabled={isNameOrEmailBlank()}>Add User</button>
        <button type="button" className="btn btn--blank" onClick={cancelHandler}>Cancel</button>
        <SpinnerContainer color={borderColor} />
      </div>
    </form>
  )
}

AdminUsersCreateForm.propTypes = {
  cancelHandler: PropTypes.func.isRequired,
  errors: PropTypes.object,
  disabled: PropTypes.bool,
  submitHandler: PropTypes.func.isRequired
}

AdminUsersCreateForm.defaultProps = {
  user: {},
  errors: {}
}

export default AdminUsersCreateForm
