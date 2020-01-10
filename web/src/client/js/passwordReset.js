import React, { useRef, useState } from 'react'
import { render } from 'react-dom'

import UserSecurityFields from 'Components/User/UserSecurity/UserSecurityFields'
import SpinnerComponent from 'Components/Spinner/SpinnerComponent'

const urlParams = new URLSearchParams(window.location.search)
const TOKEN = urlParams.get('token')

const PasswordResetForm = () => {
  const [fieldsReady, setFieldsReady] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const formRef = useRef()
  const green = getComputedStyle(document.documentElement).getPropertyValue('--color-green')

  function fieldsReadyHandler(value) {
    setFieldsReady(value)
  }

  return (
    <form
      action="/password-reset/complete"
      method="POST"
      onSubmit={() => {
        if (fieldsReady) {
          setSubmitting(true)
          return true
        } else {
          setSubmitting(false)
          return false
        }
      }}
      ref={formRef}>
      <p>You’re almost there! Pick a strong password to finish the last step.</p>
      <UserSecurityFields fieldsReadyHandler={fieldsReadyHandler} />
      <input type="hidden" id="token" name="token" value={TOKEN ? TOKEN : ''} />
      <div className="btn-group btn-group--centered">
        {!submitting && (
          <input
            className="btn"
            type="submit"
            disabled={!fieldsReady}
            value="Set password"
          />
        )}
        {submitting && <SpinnerComponent color={green} />}
      </div>
    </form>
  )
}

function renderPasswordResetPage() {
  const passwordResetDom = document.querySelector('#passwordResetForm')
  render(<PasswordResetForm />, passwordResetDom)
}

window.addEventListener('load', renderPasswordResetPage, false)

if (process.env.NODE_ENV !== 'production' && module.hot) {
  module.hot.accept()
}
