import React, { useEffect, useState } from 'react'
import PropTypes from 'prop-types'

import Form from 'Components/Form/Form'
import FormField from 'Components/Form/FormField'
import UserSecurityFields from './UserSecurityFields'

const UserSecurityComponent = ({ errors, formId, submitHandler, succeeded }) => {
  const [currentPassword, setCurrentPassword] = useState(null)
  const [newPassword, setNewPassword] = useState(null)
  const [confirmNewPassword, setConfirmNewPassword] = useState(null)
  const [fieldsReady, setFieldsReady] = useState(false)
  const [formDisabled, setFormDisabled] = useState(true)

  useEffect(() => {
    if (currentPassword && fieldsReady) {
      setFormDisabled(false)
    } else {
      setFormDisabled(true)
    }
  }, [currentPassword, fieldsReady])

  function formSubmitHandler(e) {
    if (currentPassword && fieldsReady) {
      submitHandler({ currentPassword, newPassword, confirmNewPassword })
    }
  }

  function fieldsReadyHandler(readyValue, readyPassword, readyConfirm) {
    setFieldsReady(readyValue)
    setNewPassword(readyPassword)
    setConfirmNewPassword(readyConfirm)
  }

  return (
    <Form disabled={formDisabled} name={formId} onSubmit={formSubmitHandler} submitLabel="Update my password">
      <section>
        <h2>Update Your Password</h2>
        <FormField
          aria-required={true}
          errors={errors.password}
          id="currentPassword"
          label="Current Password"
          name="password"
          onChange={(e) => { setCurrentPassword(e.target.value) }}
          placeholder="Enter your current password"
          required
          type="password"
        />
        <UserSecurityFields fieldsReadyHandler={fieldsReadyHandler} fieldsShouldReset={succeeded} />
      </section>
    </Form>
  )
}

UserSecurityComponent.propTypes = {
  errors: PropTypes.object,
  formId: PropTypes.string.isRequired,
  submitHandler: PropTypes.func.isRequired,
  succeeded: PropTypes.bool,
}

UserSecurityComponent.defaultProps = {
  errors: {},
}

export default UserSecurityComponent
