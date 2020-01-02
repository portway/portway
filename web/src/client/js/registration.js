import React, { useRef, useState } from 'react'
import { render } from 'react-dom'

import UserSecurityFields from 'Components/User/UserSecurity/UserSecurityFields'
import SpinnerComponent from 'Components/Spinner/SpinnerComponent'

import 'CSS/registration.scss'

const urlParams = new URLSearchParams(window.location.search)
const TOKEN = urlParams.get('token')

const RegistrationForm = () => {
  const [fieldsReady, setFieldsReady] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const formRef = useRef()

  function fieldsReadyHandler(value) {
    setFieldsReady(value)
  }

  function formSubmitHandler(e) {
    e.preventDefault()
    if (fieldsReady) {
      setSubmitting(true)
      formRef.current.submit()
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
      <section>
        <h2>You’re almost there! Pick a strong password to finish the last step.</h2>
        <UserSecurityFields fieldsReadyHandler={fieldsReadyHandler} />
        <input type="hidden" id="token" name="token" value={TOKEN ? TOKEN : ''} />
        <div className="btn-group">
          <input className="btn" type="submit" disabled={!fieldsReady} value="Complete registration" />
          {submitting && <SpinnerComponent color="#e5e7e6" />}
        </div>
      </section>
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
