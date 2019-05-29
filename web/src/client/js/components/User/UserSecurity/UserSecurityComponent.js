import React, { useState } from 'react'
import PropTypes from 'prop-types'

import TextField from 'Components/Form/TextField'

const UserSecurityComponent = ({ user }) => {
  const [authenticated, setAuthenticated] = useState(false)
  return (
    <form onSubmit={(e) => { e.preventDefault() }}>
      <>
        {!authenticated &&
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
        }
        {authenticated &&
        <>
          <section>
            <h2>Update Your Password</h2>
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
            <button className="btn btn--small">Update My Password</button>
          </section>
          <section>
            <h2>More Soon...</h2>
            <p>Two-Factor authentication and more coming soon.</p>
          </section>
        </>
        }
      </>
    </form>
  )
}

UserSecurityComponent.propTypes = {
  user: PropTypes.object.isRequired
}

export default UserSecurityComponent
