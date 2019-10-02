import React, { useState } from 'react'
import PropTypes from 'prop-types'

import Form from 'Components/Form/Form'
import TextField from 'Components/Form/TextField'

const UserSecurityComponent = ({ errors, formId, user, submitHandler }) => {
  const [currentPassword, setCurrentPassword] = useState(null)
  const [newPassword, setNewPassword] = useState(null)
  const [confirmNewPassword, setConfirmNewPassword] = useState(null)

  console.log(errors)

  function formSubmitHandler() {
    if (currentPassword && newPassword && confirmNewPassword) {
      submitHandler({ currentPassword, newPassword, confirmNewPassword })
    }
  }

  return (
    <Form name={formId} onSubmit={formSubmitHandler} submitLabel="Update my password">
      <section>
        <h2>Update Your Password</h2>
        <TextField
          errors={errors.password}
          id="currentPassword"
          label="Current Password"
          name="password"
          onChange={(e) => { setCurrentPassword(e.target.value) }}
          placeholder="Enter your current password"
          required
          type="password"
        />
        <TextField
          errors={errors.password}
          id="newPassword"
          label="New Password"
          name="password"
          onChange={(e) => { setNewPassword(e.target.value) }}
          placeholder="Enter a new password"
          required
          type="password"
        />
        <TextField
          errors={errors.password}
          id="confirmNewPassword"
          label="Confirm Password"
          name="password"
          onBlur={(e) => { setConfirmNewPassword(e.target.value) }}
          placeholder="Enter your new password"
          required
          type="password"
        />
      </section>
    </Form>
  )
}

UserSecurityComponent.propTypes = {
  errors: PropTypes.object,
  formId: PropTypes.string.isRequired,
  submitHandler: PropTypes.func.isRequired,
  user: PropTypes.object.isRequired,
}

export default UserSecurityComponent
