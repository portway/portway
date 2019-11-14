import React from 'react'
import { render, unmountComponentAtNode } from 'react-dom'
import zxcvbn from 'zxcvbn'

import 'CSS/registration.scss'

const submitBtn = document.querySelector('#complete-btn')
const passwordField = document.querySelector('#password')
const confirmField = document.querySelector('#confirm-password')
const pwStatus = document.querySelector('#pw-status')
const coStatus = document.querySelector('#co-status')

function isPasswordMatch() {
  return passwordField.value !== '' && passwordField.value === confirmField.value
}

function isRegReady() {
  return isPasswordMatch()
}

const resetPasswordStatus = (e) => {
  setTimeout(() => {
    unmountComponentAtNode(document.getElementById('pw-messages'))
    unmountComponentAtNode(document.getElementById('co-messages'))
    passwordField.removeEventListener('keydown', resetPasswordStatus, false)
  }, 1000)
}

const passwordScoreHandler = (e) => {
  const pw = e.target.value
  const result = zxcvbn(pw)
  // Scores are 0 - 4
  if (result.score < 3) {
    passwordField.addEventListener('keydown', resetPasswordStatus, false)
    pwStatus.style.display = 'none'
    const Validation = (
      <div name="password-tip" role="alert">
        <p>{result.feedback.warning}</p>
        {result.feedback.suggestions &&
        <ul>
          {result.feedback.suggestions.map((suggestion, index) => {
            return <li key={`s-${index}`}>{suggestion}</li>
          })}
        </ul>
        }
      </div>
    )
    render(Validation, document.getElementById('pw-messages'))
    return
  }
  unmountComponentAtNode(document.getElementById('pw-messages'))
  pwStatus.style.display = 'block'
}

const confirmPasswordHandler = (e) => {
  if (isPasswordMatch()) {
    unmountComponentAtNode(document.getElementById('co-messages'))
    coStatus.style.display = 'block'
    if (isRegReady()) {
      submitBtn.removeAttribute('disabled')
    }
  } else {
    confirmField.addEventListener('keydown', resetPasswordStatus, false)
    coStatus.style.display = 'none'
    submitBtn.setAttribute('disabled', true)
    const Validation = (
      <div name="confirm-tip" role="alert">
        <p>Your password’s do not match.</p>
      </div>
    )
    render(Validation, document.getElementById('co-messages'))
    return
  }
}

// Disable the submit button unless we know the org name has a value
submitBtn.setAttribute('disabled', true)
passwordField.addEventListener('blur', passwordScoreHandler, false)
confirmField.addEventListener('blur', confirmPasswordHandler, false)

// Todo: Investigate why the globals.js doesnt work for this one
if (process.env.NODE_ENV !== 'production' && module.hot) {
  module.hot.accept()
}

