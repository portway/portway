import React from 'react'
import PropTypes from 'prop-types'

import TextField from 'Components/Form/TextField'

const UserSecurityComponent = ({ user }) => {
  return (
    <form>
      <section>
        <h2>Change your password</h2>
        <TextField
          id="currentPassword"
          label="Current Password"
          name="password"
          onBlur={(e) => {}}
          placeholder="Enter your current password"
          required
          type="password"
        />
        <div className="form__section">
          <TextField
            id="newPassword"
            label="New Password"
            name="password"
            onBlur={(e) => {}}
            placeholder="Enter a new password"
            required
            type="password"
          />
          <TextField
            id="confirmPassword"
            label="Confirm Password"
            name="password"
            onBlur={(e) => {}}
            placeholder="Enter your new password"
            required
            type="password"
          />
        </div>
      </section>
      <button className="btn btn-primary">Update My Password</button>
    </form>
  )
}

UserSecurityComponent.propTypes = {
  user: PropTypes.object.isRequired
}

export default UserSecurityComponent
