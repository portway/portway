import React, { useRef, useState } from 'react'
import { render } from 'react-dom'

import UserSecurityFields from 'Components/User/UserSecurity/UserSecurityFields'
import SpinnerComponent from 'Components/Spinner/SpinnerComponent'

const urlParams = new URLSearchParams(window.location.search)
const TOKEN = urlParams.get('token')

const RegistrationForm = () => {
  const [fieldsReady, setFieldsReady] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const formRef = useRef()
  const green = getComputedStyle(document.documentElement).getPropertyValue('--color-green')

  function fieldsReadyHandler(value) {
    setFieldsReady(value)
  }

  function formSubmitHandler() {
    if (fieldsReady) {
      setSubmitting(true)
      return true
    } else {
      setSubmitting(false)
    }
    return false
  }

  return (
    <form
      action="/sign-up/registration/complete"
      method="POST"
      onSubmit={formSubmitHandler}
      ref={formRef}
    >
      <p>You’re almost there! Pick a strong password to finish the last step.</p>
      <UserSecurityFields fieldsReadyHandler={fieldsReadyHandler} />
      <input type="hidden" id="token" name="token" value={TOKEN ? TOKEN : ''} />
      <div className="btn-group btn-group--centered">
        {!submitting &&
          <input
            className="btn"
            type="submit"
            disabled={!fieldsReady}
            value="Complete registration"
          />
        }
        {submitting && <SpinnerComponent color={green} />}
      </div>
    </form>
  )
}

function renderRegistrationPage() {
  const registrationDom = document.querySelector('#registrationForm')
  render(<RegistrationForm />, registrationDom)
}

window.addEventListener('load', renderRegistrationPage, false)

if (process.env.NODE_ENV !== 'production' && module.hot) {
  module.hot.accept()
}
