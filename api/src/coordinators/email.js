import fs from 'fs'
import path from 'path'
import ejs from 'ejs'

import { sendSingleRecipientEmail } from '../integrators/email'
import BusinessOrganization from '../businesstime/organization'
import { SUPPORT_EMAIL } from '../constants/email'
import tokenSettings from '../libs/tokenSettings'

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
  PAYMENT_SUCCESS: 'PAYMENT_SUCCESS',
  SUBSCRIPTION_CANCELED: 'SUBSCRIPTION_CANCELED',
  TRIAL_WILL_END: 'TRIAL_WILL_END'
}
const EMAIL_TEMPLATE_FILES = {
  [EMAIL_TEMPLATES.INVITE]: 'invite.html',
  [EMAIL_TEMPLATES.FREE_INVITE]: 'free-account-invite.html',
  [EMAIL_TEMPLATES.FORGOT_PASSWORD]: 'forgot-password.html',
  [EMAIL_TEMPLATES.PASSWORD_CHANGE]: 'password-change.html',
  [EMAIL_TEMPLATES.SIGNUP_CONFIRM]: 'signup.html',
  [EMAIL_TEMPLATES.PAYMENT_FAILED]: 'payment-failed.html',
  [EMAIL_TEMPLATES.PAYMENT_SUCCESS]: 'payment-success.html',
  [EMAIL_TEMPLATES.SUBSCRIPTION_CANCELED]: 'subscription-canceled.html',
  [EMAIL_TEMPLATES.TRIAL_WILL_END]: 'trial-will-end.html',
  [EMAIL_TEMPLATES.TRIAL_ENDED]: 'trial-ended.html'
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

  const subject = `Welcome to Portway!`
  const textBody = `${invitedText}\n\n${linkUrl}`
  const htmlBody = await EJS_TEMPLATE_FUNCTIONS[EMAIL_TEMPLATES.INVITE]({ invitedText, linkUrl })

  await sendSingleRecipientEmail({ address: email, htmlBody, textBody, subject })
}

async function sendPasswordChangeEmail(address) {
  const subject = '[Portway] Password changed'
  const textBody = `Your Portway password has been changed, if you were not the one who made this change, please contact ${SUPPORT_EMAIL}`
  const htmlBody = await EJS_TEMPLATE_FUNCTIONS[EMAIL_TEMPLATES.PASSWORD_CHANGE]({ textBody })

  await sendSingleRecipientEmail({ address, htmlBody, textBody, subject })
}

async function sendPasswordResetEmail(resetLink, email) {
  const subject = '[Portway] Password reset'
  const textBody = `Here is your link to reset your password\n\n${resetLink}`
  const htmlBody = await EJS_TEMPLATE_FUNCTIONS[EMAIL_TEMPLATES.FORGOT_PASSWORD]({ resetLink })

  await sendSingleRecipientEmail({ address: email, htmlBody, textBody, subject })
}

async function sendFreeAccountInvite(linkUrl, email) {
  const subject = 'Welcome to Portway!'
  const expirePeriod = tokenSettings.accountInviteExpiration // 14 days
  const textBody = `Welcome to Portway! We'd like to offer you a free account you can claim here:\n\n${linkUrl}\n\nThis invite expires in ${expirePeriod}.`
  const htmlBody = await EJS_TEMPLATE_FUNCTIONS[EMAIL_TEMPLATES.FREE_INVITE]({ linkUrl, expirePeriod })

  return sendSingleRecipientEmail({ address: email, htmlBody, textBody, subject })
}

async function sendSignupVerification(linkUrl, email) {
  const subject = 'Portway email confirmation'
  const textBody = `Thanks for trying out Portway!\n\nActivate your new account by verifying your email address:\n\n${linkUrl}`
  const htmlBody = await EJS_TEMPLATE_FUNCTIONS[EMAIL_TEMPLATES.SIGNUP_CONFIRM]({ linkUrl })

  await sendSingleRecipientEmail({ address: email, htmlBody, textBody, subject })
}

async function sendPaymentFailed(email) {
  const subject = '[Portway] Payment failed'
  const linkUrl = `${CLIENT_URL}/d/admin/billing`
  const textBody = `Your payment for Portway has failed to process. We’ll try a few times over the next week. After that, your account will be deactivated. Please visit the billing page to update your info: ${linkUrl}`

  const htmlBody = await EJS_TEMPLATE_FUNCTIONS[EMAIL_TEMPLATES.PAYMENT_FAILED]({ textBody, linkUrl })

  await sendSingleRecipientEmail({
    address: email,
    textBody,
    htmlBody,
    subject
  })
}

async function sendPaymentSuccess(email, amount) {
  const subject = 'Payment successful'
  const displayAmount = `$${amount / 100}.00`
  const message = `You've been charged ${displayAmount}`

  const htmlBody = await EJS_TEMPLATE_FUNCTIONS[EMAIL_TEMPLATES.PAYMENT_SUCCESS]({ paymentAmount: displayAmount })

  await sendSingleRecipientEmail({
    address: email,
    textBody: message,
    htmlBody,
    subject
  })
}

async function sendSubscriptionCanceled(email) {
  const subject = 'Portway subscription canceled'
  const message = 'Your portway subscription has been canceled'

  const htmlBody = await EJS_TEMPLATE_FUNCTIONS[EMAIL_TEMPLATES.SUBSCRIPTION_CANCELED]({})

  sendSingleRecipientEmail({
    address: email,
    textBody: message,
    htmlBody,
    subject
  })
}

async function sendTrialWillEnd(email) {
  const subject = 'Your Portway trial is ending soon'
  const linkUrl = `${CLIENT_URL}/d/admin/billing`
  const textBody = `Your Portway trial will end in 3 days. Add a payment method to keep your account active: ${linkUrl}`

  const htmlBody = await EJS_TEMPLATE_FUNCTIONS[EMAIL_TEMPLATES.TRIAL_WILL_END]({ textBody, linkUrl })

  await sendSingleRecipientEmail({
    address: email,
    textBody,
    htmlBody,
    subject
  })
}

async function sendTrialEnded(email) {
  const subject = 'Your Portway trial has ended'
  const linkUrl = `${CLIENT_URL}/d/admin/billing`
  const textBody = `Your Portway trial has ended. Add a payment method to re-activate your account: ${linkUrl}`

  const htmlBody = await EJS_TEMPLATE_FUNCTIONS[EMAIL_TEMPLATES.TRIAL_ENDED]({ textBody, linkUrl })

  await sendSingleRecipientEmail({
    address: email,
    textBody,
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
  sendPaymentSuccess,
  sendSubscriptionCanceled,
  sendTrialWillEnd,
  sendTrialEnded
}
