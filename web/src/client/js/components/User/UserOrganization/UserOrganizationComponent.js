import React, { useState } from 'react'
import PropTypes from 'prop-types'

import TextField from 'Components/Form/TextField'
import Checkbox from 'Components/Form/Checkbox'

const UserOrganizationComponent = ({ errors, organization, submitHandler }) => {
  const [name, setName] = useState(organization.name)
  const [allowProjectCreation, setAllowProjectCreation] = useState(organization.allowUserProjectCreation)

  function formSubmitHandler(e) {
    e.preventDefault()
    submitHandler({ name, allowProjectCreation })
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
          name="organization[allowUserProjectCreation]"
          onChange={(e) => { setAllowProjectCreation(e.target.checked) }}
          value={allowProjectCreation}
        />
      </section>
      <div className="btn-group">
        <button className="btn btn-primary">Update Organization</button>
      </div>
    </form>
  )
}

UserOrganizationComponent.propTypes = {
  errors: PropTypes.object,
  organization: PropTypes.object.isRequired,
  submitHandler: PropTypes.func.isRequired
}

UserOrganizationComponent.defaultProps = {
  errors: {},
  organization: {}
}

export default UserOrganizationComponent
