import React, { useState } from 'react'
import PropTypes from 'prop-types'

import Form from 'Components/Form/Form'
import TextField from 'Components/Form/TextField'

const UserSecurityComponent = ({ submitHandler, formId }) => {
  const [authenticated, setAuthenticated] = useState(true)
  const [currentPassword, setCurrentPassword] = useState(null)
  const [newPassword, setNewPassword] = useState(null)
  const [confirmNewPassword, setConfirmNewPassword] = useState(null)

  function formSubmitHandler() {
    if (currentPassword && newPassword && confirmNewPassword) {
      submitHandler({ currentPassword, newPassword, confirmNewPassword })
    }
  }

  return (
    <Form name={formId} onSubmit={formSubmitHandler} submitLabel="Update my password">
      <>
        {/* {!authenticated &&
        <section>
          <h2>Security Settings</h2>
          <p>Please authenticate again, before changing your security preferences</p>
          <div className="form-field form-field--with-button">
            <div className="field">
              <input type="password" name="currentPassword" placeholder="Enter your password" />
            </div>
            <button className="btn" onClick={() => { setAuthenticated(true) }}>Authenticate</button>
          </div>
        </section>
        } */}
        {authenticated &&
        <>
          <section>
            <h2>Update Your Password</h2>
            <TextField
              id="currentPassword"
              label="Current Password"
              name="password"
              onChange={(e) => { setCurrentPassword(e.target.value) }}
              placeholder="Enter your current password"
              required
              type="password"
            />
            <TextField
              id="newPassword"
              label="New Password"
              name="password"
              onChange={(e) => { setNewPassword(e.target.value) }}
              placeholder="Enter a new password"
              required
              type="password"
            />
            <TextField
              id="confirmPassword"
              label="Confirm Password"
              name="password"
              onBlur={(e) => { setConfirmNewPassword(e.target.value) }}
              placeholder="Enter your new password"
              required
              type="password"
            />
            <button className="btn btn--small">Update My Password</button>
          </section>
          <section>
            <h2>More Soon...</h2>
            <p>Two-Factor authentication and more coming soon.</p>
          </section>
        </>
        }
      </>
    </Form>
  )
}

UserSecurityComponent.propTypes = {
  user: PropTypes.object.isRequired,
  submitHandler: PropTypes.func.isRequired,
  formId: PropTypes.string.isRequired
}

export default UserSecurityComponent
