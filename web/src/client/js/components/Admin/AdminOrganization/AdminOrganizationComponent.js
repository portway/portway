import React, { useState } from 'react'
import PropTypes from 'prop-types'

import SpinnerContainer from 'Components/Spinner/SpinnerContainer'
import TextField from 'Components/Form/TextField'
import Checkbox from 'Components/Form/Checkbox'

const AdminOrganizationComponent = ({ errors, organization, submitHandler }) => {
  const [name, setName] = useState(organization.name)
  const [allowAdminProjectCreation, setAllowAdminProjectCreation] = useState(organization.allowAdminProjectCreation)

  function formSubmitHandler(e) {
    e.preventDefault()
    submitHandler({ name, allowAdminProjectCreation })
    return false
  }

  const helpText = 'Checking this box allows anyone in your organization to create projects'

  return (
    <form onSubmit={formSubmitHandler}>
      <section>
        <h2>General information</h2>
        <TextField
          errors={errors.name}
          id="orgName"
          label="Organization Name"
          name="name"
          onChange={(e) => { setName(e.target.value) }}
          placeholder="ACME, Inc"
          required
          value={organization.name}
        />
      </section>
      <section>
        <h2>Privacy</h2>
        <Checkbox
          errors={errors.privacy}
          help={helpText}
          id="orgProjectCreation"
          label={`Everyone in ${organization.name} can create projects`}
          large={true}
          name="organization[allowAdminProjectCreation]"
          onChange={(e) => { setAllowAdminProjectCreation(e.target.checked) }}
          value={allowAdminProjectCreation}
        />
      </section>
      <div className="btn-group">
        <button className="btn btn-primary">Update Organization <SpinnerContainer color="#ffffff" /></button>
      </div>
    </form>
  )
}

AdminOrganizationComponent.propTypes = {
  errors: PropTypes.object,
  organization: PropTypes.object.isRequired,
  submitHandler: PropTypes.func.isRequired
}

AdminOrganizationComponent.defaultProps = {
  errors: {},
  organization: {}
}

export default AdminOrganizationComponent
