import { debounce } from 'Shared/utilities'

import 'CSS/registration.scss'

const submitBtn = document.querySelector('#complete-btn')
const passwordField = document.querySelector('#password')
const confirmField = document.querySelector('#confirm-password')
const passwordHelp = document.querySelector('#password-help')

function isPasswordMatch() {
  return passwordField.value !== '' && passwordField.value === confirmField.value
}

function isRegReady() {
  return isPasswordMatch()
}

const passwordCheckHandler = debounce(200, (e) => {
  if (isPasswordMatch()) {
    confirmField.classList.remove('is-danger')
    passwordHelp.style.display = 'none'
    if (isRegReady()) {
      submitBtn.removeAttribute('disabled')
    }
  } else {
    confirmField.classList.add('is-danger')
    passwordHelp.style.display = 'block'
    submitBtn.setAttribute('disabled', true)
  }
})

// Disable the submit button unless we know the org name has a value
submitBtn.setAttribute('disabled', true)
confirmField.addEventListener('keydown', passwordCheckHandler, false)

// Todo: Investigate why the globals.js doesnt work for this one
if (process.env.NODE_ENV !== 'production' && module.hot) {
  module.hot.accept()
}

