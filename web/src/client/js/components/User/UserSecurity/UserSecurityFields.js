import React, { useEffect, useState } from 'react'
import PropTypes from 'prop-types'
import zxcvbn from 'zxcvbn'

import { MIN_PASSWORD_LENGTH } from 'Shared/constants'
import { debounce } from 'Shared/utilities'
import { CheckIcon, RemoveIcon } from 'Components/Icons'
import FormField from 'Components/Form/FormField'

import './_UserSecurityFields.scss'

const redColor = getComputedStyle(document.documentElement).getPropertyValue('--color-red')

const UserSecurityFields = ({ fieldsReadyHandler }) => {
  // Password and Confirm password
  const [newPassword, setNewPassword] = useState(null)
  const [confirmNewPassword, setConfirmNewPassword] = useState(null)

  // Password meter
  const [passwordStatus, setPasswordStatus] = useState(null)
  const [passwordScore, setPasswordScore] = useState(null)
  const [confirmStatus, setConfirmStatus] = useState(null)

  // monitor fields and trigger fieldsReadyHandler if everything is good
  useEffect(() => {
    function areFieldsReady() {
      return newPassword && newPassword === confirmNewPassword
    }
    fieldsReadyHandler(areFieldsReady(), newPassword, confirmNewPassword)
  }, [newPassword, confirmNewPassword, fieldsReadyHandler])

  function resetPassword() {
    setNewPassword(null)
    setPasswordScore(0)
  }

  const passwordValidationHandler = debounce(500, (password) => {
    // Reset it all if we're blank
    if (password === '' || password.length === 0) {
      resetPassword()
      return
    }
    // Do we have enough characters?
    if (password.length < MIN_PASSWORD_LENGTH) {
      setPasswordStatus({ warning: `Your password must be at least ${MIN_PASSWORD_LENGTH} characters.` })
      resetPassword()
      return
    }
    // Did we put in a confirm password and then change the password?
    if (confirmNewPassword && password !== confirmNewPassword) {
      setConfirmStatus({ warning: 'Your passwords do not match.' })
    }
    // Did we change the password after we updated the confirm password?
    if (confirmNewPassword === password) {
      setConfirmStatus(null)
    }
    const result = zxcvbn(password)
    setPasswordStatus(result.feedback)
    setPasswordScore(result.score)
    // Ok we'll allow this password, now match it
    if (result.score >= 3) {
      setNewPassword(password)
      setPasswordStatus(null)
    } else {
      setNewPassword(null)
    }
  })

  const passwordMatchHandler = debounce(500, (pw) => {
    if (pw !== newPassword) {
      setConfirmStatus({ warning: 'Your passwords do not match.' })
      setConfirmNewPassword(pw)
    } else {
      setConfirmStatus(null)
      setConfirmNewPassword(pw)
    }
  })

  return (
    <div className="user-security-fields">
      <FormField
        aria-describedby="pw-popover"
        aria-required={true}
        autoComplete="new-password"
        id="password"
        label="New Password"
        name="password"
        onChange={e => passwordValidationHandler(e.target.value)}
        placeholder="Enter a new password"
        required
        status={newPassword && <CheckIcon fill="#51a37d" />}
        type="password"
      />
      {passwordStatus && passwordStatus.warning &&
      <div name="pw-popover" role="alert">
        <div className="data">
          <RemoveIcon fill={redColor} /> <span>{passwordStatus.warning}</span>
        </div>
        {passwordStatus.suggestions &&
        <ul>
          {passwordStatus.suggestions.map((suggestion, index) => {
            return <li key={`s-${index}`}>{suggestion}</li>
          })}
        </ul>
        }
      </div>
      }
      <FormField
        aria-describedby="co-popover"
        aria-required={true}
        autoComplete="new-password"
        id="confirm-password"
        label="Confirm Password"
        name="confirm-password"
        onChange={e => passwordMatchHandler(e.target.value)}
        placeholder="Enter your new password"
        required
        status={confirmNewPassword && newPassword === confirmNewPassword && <CheckIcon fill="#51a37d" />}
        type="password"
      />
      {confirmStatus && confirmStatus.warning &&
      <div name="co-popover" role="alert">
        <div className="data">
          <RemoveIcon fill={redColor} /> {confirmStatus.warning}
        </div>
      </div>
      }
      <div className="user-security-fields__password-score">
        <p>Password strength</p>
        <meter low="1" optimum="4" min="1" max="4" value={passwordScore} />
      </div>
    </div>
  )
}

UserSecurityFields.propTypes = {
  fieldsReadyHandler: PropTypes.func.isRequired,
}

export default UserSecurityFields
