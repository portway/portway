import React from 'react'
import { render, unmountComponentAtNode } from 'react-dom'
import zxcvbn from 'zxcvbn'

import PopoverComponent from 'Components/Popover/PopoverComponent'

import 'CSS/registration.scss'

const submitBtn = document.querySelector('#complete-btn')
const passwordField = document.querySelector('#password')
const confirmField = document.querySelector('#confirm-password')
const pwStatus = document.querySelector('#pw-status')
const coStatus = document.querySelector('#co-status')

let passwordFieldSuccess = false

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
    // Focus the input, and clear the popover once we start typing
    setTimeout(() => { passwordField.focus() }, 100)
    passwordFieldSuccess = false
    passwordField.addEventListener('keydown', resetPasswordStatus, false)
    pwStatus.style.display = 'none'
    const Popover = (
      <PopoverComponent name="password-tip">
        <p>{result.feedback.warning}</p>
        {result.feedback.suggestions &&
        <ul>
          {result.feedback.suggestions.map((suggestion, index) => {
            return <li key={`s-${index}`}>{suggestion}</li>
          })}
        </ul>
        }
      </PopoverComponent>
    )
    render(Popover, document.getElementById('pw-messages'))
    return
  }
  unmountComponentAtNode(document.getElementById('pw-messages'))
  passwordFieldSuccess = true
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
    if (passwordFieldSuccess) {
      // Focus the input, and clear the popover once we start typing
      setTimeout(() => { confirmField.focus() }, 100)
      confirmField.addEventListener('keydown', resetPasswordStatus, false)
      coStatus.style.display = 'none'
      submitBtn.setAttribute('disabled', true)
      const Popover = (
        <PopoverComponent name="confirm-tip">
          <p>Your password’s do not match.</p>
        </PopoverComponent>
      )
      render(Popover, document.getElementById('co-messages'))
      return
    }
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

