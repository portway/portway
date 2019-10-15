import React from 'react'
import { render, unmountComponentAtNode } from 'react-dom'
import zxcvbn from 'zxcvbn'

import { debounce } from 'Shared/utilities'
import PopoverComponent from 'Components/Popover/PopoverComponent'

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

const passwordScoreHandler = debounce(500, (e) => {
  const pw = e.target.value
  const result = zxcvbn(pw)
  // Scores are 0 - 4
  if (result.score < 3) {
    confirmField.setAttribute('disabled', true)
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
  confirmField.removeAttribute('disabled')
  unmountComponentAtNode(document.getElementById('pw-messages'))
  pwStatus.style.display = 'block'
})

const confirmPasswordHandler = debounce(200, (e) => {
  if (isPasswordMatch()) {
    confirmField.classList.remove('is-danger')
    unmountComponentAtNode(document.getElementById('co-messages'))
    coStatus.style.display = 'block'
    if (isRegReady()) {
      submitBtn.removeAttribute('disabled')
    }
  } else {
    const Popover = (
      <PopoverComponent name="confirm-tip">
        <p>Your password’s do not match.</p>
      </PopoverComponent>
    )
    render(Popover, document.getElementById('co-messages'))
    coStatus.style.display = 'none'
    submitBtn.setAttribute('disabled', true)
    return
  }
})

// Disable the submit button unless we know the org name has a value
submitBtn.setAttribute('disabled', true)
passwordField.addEventListener('keyup', passwordScoreHandler, false)
confirmField.addEventListener('keyup', confirmPasswordHandler, false)

// Todo: Investigate why the globals.js doesnt work for this one
if (process.env.NODE_ENV !== 'production' && module.hot) {
  module.hot.accept()
}

