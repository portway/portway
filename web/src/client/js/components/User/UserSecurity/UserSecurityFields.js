import React, { useCallback, useEffect, useState } from 'react'
import PropTypes from 'prop-types'
import zxcvbn from 'zxcvbn'

import { MIN_PASSWORD_LENGTH } from 'Shared/constants'
import { debounce } from 'Shared/utilities'
import { CheckIcon, RemoveIcon } from 'Components/Icons'
import FormField from 'Components/Form/FormField'

import './_UserSecurityFields.scss'

const redColor = getComputedStyle(document.documentElement).getPropertyValue('--color-red')

const UserSecurityFields = ({ fieldsReadyHandler, fieldsShouldReset }) => {
  // Password and Confirm password
  const [newPassword, setNewPassword] = useState(null)
  const [confirmNewPassword, setConfirmNewPassword] = useState(null)

  // Password meter
  const [passwordStatus, setPasswordStatus] = useState(null)
  const [passwordSummary, setPasswordSummary] = useState(null)
  const [passwordScore, setPasswordScore] = useState(null)
  const [confirmStatus, setConfirmStatus] = useState(null)

  const passwordIsValid = useCallback(() => {
    return newPassword && newPassword.length >= MIN_PASSWORD_LENGTH
  }, [newPassword])

  const green = getComputedStyle(document.documentElement).getPropertyValue('--color-green')

  // monitor fields and trigger fieldsReadyHandler if everything is good
  useEffect(() => {
    function areFieldsReady() {
      return passwordIsValid() && newPassword === confirmNewPassword
    }
    fieldsReadyHandler(areFieldsReady(), newPassword, confirmNewPassword)
  }, [newPassword, confirmNewPassword, fieldsReadyHandler, passwordIsValid])

  useEffect(() => {
    if (fieldsShouldReset) {
      resetPassword()
    }
  }, [fieldsShouldReset])

  function resetPassword() {
    setNewPassword(null)
    setConfirmNewPassword(null)
    setPasswordStatus(null)
    setPasswordSummary(null)
    setPasswordScore(0)
    setConfirmStatus(null)
  }

  const passwordValidationHandler = (password) => {
    // Reset it all if we're blank
    if (password === '' || password.length === 0) {
      resetPassword()
      return
    }

    // Set the password
    setNewPassword(password)

    // Set the score and summary, always
    const result = zxcvbn(password)
    setPasswordScore(result.score === 0 ? 1 : result.score)
    setPasswordStatus(result.feedback.warning)
    setPasswordSummary(result.feedback.suggestions)

    // Did we put in a confirm password and then change the password?
    if (confirmNewPassword) {
      if (password !== confirmNewPassword) {
        setConfirmStatus('Your passwords do not match.')
      }
      // Did we change the password after we updated the confirm password?
      if (confirmNewPassword === password) {
        setConfirmStatus(null)
      }
    }
    // Do we have enough characters?
    if (password.length < MIN_PASSWORD_LENGTH) {
      setPasswordStatus(`Your password must be at least ${MIN_PASSWORD_LENGTH} characters.`)
    }
    // Ok we'll allow this password, now match it
    if (password.length >= MIN_PASSWORD_LENGTH) {
      setPasswordStatus(null)
    }
  }

  const passwordMatchHandler = debounce(500, (pw) => {
    if (pw !== newPassword) {
      setConfirmStatus('Your passwords do not match.')
    } else {
      setConfirmStatus(null)
    }
    setConfirmNewPassword(pw)
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
        status={passwordIsValid() && <CheckIcon fill={green} />}
        type="password"
      />
      {(passwordStatus || passwordSummary && passwordSummary.length > 0) &&
      <div name="pw-popover" role="alert">
        {passwordStatus &&
        <div className="data">
          <RemoveIcon width="14" height="14" fill={redColor} /> <span>{passwordStatus}</span>
        </div>
        }
        {passwordSummary &&
        <ul>
          {passwordSummary.map((suggestion, index) => {
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
        status={passwordIsValid() && newPassword === confirmNewPassword && <CheckIcon fill={green} />}
        type="password"
      />
      {confirmStatus &&
      <div name="co-popover" role="alert">
        <div className="data">
          <RemoveIcon width="14" height="14" fill={redColor} /> {confirmStatus}
        </div>
      </div>
      }
      <div className="user-security-fields__password-score">
        <p>Password strength</p>
        <meter low="0" optimum="4" min="0" max="4" value={passwordScore} />
      </div>
    </div>
  )
}

UserSecurityFields.propTypes = {
  fieldsReadyHandler: PropTypes.func.isRequired,
  fieldsShouldReset: PropTypes.bool,
}

export default UserSecurityFields
