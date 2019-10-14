import React, { useState } from 'react'
import PropTypes from 'prop-types'
import zxcvbn from 'zxcvbn'

import { MIN_PASSWORD_LENGTH } from 'Shared/constants'
import { debounce } from 'Shared/utilities'
import PopoverComponent from 'Components/Popover/PopoverComponent'
import Form from 'Components/Form/Form'
import TextField from 'Components/Form/TextField'

import './_UserSecurity.scss'

const UserSecurityComponent = ({ errors, formId, submitHandler }) => {
  const [currentPassword, setCurrentPassword] = useState(null)
  const [newPassword, setNewPassword] = useState(null)
  const [confirmNewPassword, setConfirmNewPassword] = useState(null)
  // Password meter
  const [passwordStatus, setPasswordStatus] = useState(null)
  const [passwordScore, setPasswordScore] = useState(null)
  const [confirmStatus, setConfirmStatus] = useState(null)

  function formSubmitHandler(e) {
    if (currentPassword && newPassword && confirmNewPassword) {
      setPasswordStatus(null)
      setPasswordScore(null)
      setConfirmStatus(null)
      submitHandler({ currentPassword, newPassword, confirmNewPassword })
    }
  }

  const passwordValidationHandler = debounce(500, (password) => {
    if (password === '' || password.length === 0) {
      setPasswordStatus(null)
      return
    }
    if (password.length < MIN_PASSWORD_LENGTH) {
      setPasswordStatus({ warning: `Your password must be at least ${MIN_PASSWORD_LENGTH} characters.` })
      return
    }
    const result = zxcvbn(password)
    setPasswordStatus(result.feedback)
    setPasswordScore(result.score)
    // Ok we'll allow this password, now match it
    if (result.score >= 3) {
      setNewPassword(password)
    }
  })

  const passwordMatchHandler = debounce(500, (pw) => {
    if (pw !== newPassword) {
      setConfirmStatus({ warning: 'Your password doesn’t match.' })
      return
    } else {
      setConfirmStatus(null)
      setConfirmNewPassword(pw)
      return
    }
  })

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
          errors={errors.newPassword}
          id="newPassword"
          label="New Password"
          name="password"
          onChange={e => passwordValidationHandler(e.target.value)}
          placeholder="Enter a new password"
          required
          type="password"
        />
        {passwordStatus && passwordStatus.warning &&
        <PopoverComponent className="user-security__password-meter">
          <p className="user-security__password-status">{passwordStatus.warning}</p>
          {passwordStatus.suggestions &&
          <ul className="user-security__password-suggestion">
            {passwordStatus.suggestions.map((suggestion, index) => {
              return <li key={`s-${index}`}>{suggestion}</li>
            })}
          </ul>
          }
        </PopoverComponent>
        }
        <TextField
          errors={errors.confirmNewPassword}
          id="confirmNewPassword"
          label="Confirm Password"
          name="password"
          onChange={e => passwordMatchHandler(e.target.value)}
          placeholder="Enter your new password"
          required
          type="password"
        />
        {confirmStatus && confirmStatus.warning &&
        <PopoverComponent className="user-security__password-meter">
          <p className="user-security__password-status">{confirmStatus.warning}</p>
        </PopoverComponent>
        }
        {passwordScore &&
        <div className="user-security__password-score">
          <p className="user-security__password-score-title">Password strength</p>
          <meter low="1" optimum="4" min="1" max="4" value={passwordScore} />
        </div>
        }
      </section>
    </Form>
  )
}

UserSecurityComponent.propTypes = {
  errors: PropTypes.object,
  formId: PropTypes.string.isRequired,
  submitHandler: PropTypes.func.isRequired,
}

UserSecurityComponent.defaultProps = {
  errors: {},
}

export default UserSecurityComponent
