import React from 'react'
import PropTypes from 'prop-types'

import TextField from 'Components/Form/TextField'
import Checkbox from 'Components/Form/Checkbox'

const UserOrganizationComponent = ({ errors }) => {
  const helpText = 'Checking this box allows anyone in your organization to create projects'
  return (
    <form className="admin-settings__info" onSubmit={(e) => { e.preventDefault() }}>
      <section>
        <h2>General information</h2>
        <TextField
          id="orgName"
          label="Organization Name"
          name="name"
          errors={errors.name}
          onChange={(e) => {}}
          placeholder="ACME, Inc"
          value={null} />
      </section>
      <section>
        <h2>Privacy</h2>
        <Checkbox
          id="orgProjectCreation"
          help={helpText}
          label="Everyone in ACME, Inc can create projects"
          large={true}
          name="organization[projectCreation]"
          errors={errors.privacy}
          onChange={null}
          value={true} />
      </section>
    </form>
  )
}

UserOrganizationComponent.propTypes = {
  errors: PropTypes.object
}

export default UserOrganizationComponent
