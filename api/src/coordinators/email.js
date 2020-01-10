import fs from 'fs'
import path from 'path'
import ejs from 'ejs'

import { sendSingleRecipientEmail } from '../integrators/email'
import BusinessOrganization from '../businesstime/organization'
import { SUPPORT_EMAIL } from '../constants/email'

const { CLIENT_URL } = process.env

// Email template directory relative to this file
const EMAIL_TEMPLATE_DIRECTORY = '../templates/email/ejs/'

// key/vals must be the same!
const EMAIL_TEMPLATES = {
  INVITE: 'INVITE',
  FREE_INVITE: 'FREE_INVITE',
  PASSWORD_CHANGE: 'PASSWORD_CHANGE',
  FORGOT_PASSWORD: 'FORGOT_PASSWORD',
  SIGNUP_CONFIRM: 'SIGNUP_CONFIRM',
  PAYMENT_FAILED: 'PAYMENT_FAILED',
  PAYMENT_SUCCESS: 'PAYMENT_SUCCESS'
}
const EMAIL_TEMPLATE_FILES = {
  [EMAIL_TEMPLATES.INVITE]: 'invite.html',
  [EMAIL_TEMPLATES.FREE_INVITE]: 'free-account-invite.html',
  [EMAIL_TEMPLATES.FORGOT_PASSWORD]: 'forgot-password.html',
  [EMAIL_TEMPLATES.PASSWORD_CHANGE]: 'password-change.html',
  [EMAIL_TEMPLATES.SIGNUP_CONFIRM]: 'signup.html',
  [EMAIL_TEMPLATES.PAYMENT_FAILED]: 'payment-failed.html',
  [EMAIL_TEMPLATES.PAYMENT_SUCCESS]: 'payment-success.html'
}
const EJS_TEMPLATE_FUNCTIONS = {}

// Pre-compile ejs render functions from files on load
Object.keys(EMAIL_TEMPLATE_FILES).forEach( (key) => {
  const fileName = EMAIL_TEMPLATE_FILES[key]
  EJS_TEMPLATE_FUNCTIONS[key] = ejs.compile(
    fs.readFileSync(path.join(__dirname, EMAIL_TEMPLATE_DIRECTORY, fileName), 'utf8'),
    {
      async: true // returns an async render func
    }
  )
})

async function sendInvitationEmail(email, token, orgId) {
  const organization = await BusinessOrganization.findSanitizedById(orgId)

  const linkUrl = `${CLIENT_URL}/sign-up/registration/complete?token=${token}`
  const invitedText = `You've been invited to join ${organization.name} on Portway!`

  const htmlBody = await EJS_TEMPLATE_FUNCTIONS[EMAIL_TEMPLATES.INVITE]({ invitedText, linkUrl })
  const textBody = `${invitedText}\n${linkUrl}`
  const subject = `Portway Invitation`

  await sendSingleRecipientEmail({ address: email, htmlBody, textBody, subject })
}

async function sendPasswordChangeEmail(address) {
  const subject = 'Password Changed [Portway]'
  const bodyText = `Your Portway password has been changed, if you were not the one who made this change, please contact ${SUPPORT_EMAIL}`

  const htmlBody = await EJS_TEMPLATE_FUNCTIONS[EMAIL_TEMPLATES.PASSWORD_CHANGE]({ bodyText })
  const textBody = bodyText

  await sendSingleRecipientEmail({ address, htmlBody, textBody, subject })
}

async function sendPasswordResetEmail(resetLink, email) {
  const htmlBody = await EJS_TEMPLATE_FUNCTIONS[EMAIL_TEMPLATES.FORGOT_PASSWORD]({ resetLink })

  const textBody = `Here is your link to reset your password: ${resetLink}`

  const subject = 'Portway password reset'

  await sendSingleRecipientEmail({ address: email, htmlBody, textBody, subject })
}

async function sendFreeAccountInvite(linkUrl, email) {
  const htmlBody = await EJS_TEMPLATE_FUNCTIONS[EMAIL_TEMPLATES.FREE_INVITE]({ linkUrl })

  const textBody = `Welcome to Portway! We'd like to offer you a free account you can claim here: ${linkUrl}`

  const subject = 'Free Account: Welcome to Portway!'

  return sendSingleRecipientEmail({ address: email, htmlBody, textBody, subject })
}

async function sendSignupVerification(linkUrl, email) {
  const htmlBody = await EJS_TEMPLATE_FUNCTIONS[EMAIL_TEMPLATES.SIGNUP_CONFIRM]({ linkUrl })

  const textBody = `Here is your link to verify your email for Portway: ${linkUrl}`

  const subject = 'Portway email confirmation'

  await sendSingleRecipientEmail({ address: email, htmlBody, textBody, subject })
}

async function sendPaymentFailed(email) {
  const subject = 'Payment failed'
  const message = 'Portway payment failed'

  const htmlBody = await EJS_TEMPLATE_FUNCTIONS[EMAIL_TEMPLATES.PAYMENT_FAILED]({})

  await sendSingleRecipientEmail({
    address: email,
    textBody: message,
    htmlBody,
    subject
  })
}

async function sendPaymentSuccess(email) {
  const subject = 'Payment successful'
  const message = 'Portway payment was successful'

  const htmlBody = await EJS_TEMPLATE_FUNCTIONS[EMAIL_TEMPLATES.PAYMENT_SUCCESS]({})

  await sendSingleRecipientEmail({
    address: email,
    textBody: message,
    htmlBody,
    subject
  })
}

export default {
  sendInvitationEmail,
  sendPasswordChangeEmail,
  sendPasswordResetEmail,
  sendFreeAccountInvite,
  sendSignupVerification,
  sendPaymentFailed,
  sendPaymentSuccess
}
