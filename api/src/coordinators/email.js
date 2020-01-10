import fs from 'fs'
import path from 'path'
import ejs from 'ejs'

import { sendSingleRecipientEmail } from '../integrators/email'
import BusinessOrganization from '../businesstime/organization'
import { SUPPORT_EMAIL } from '../constants/email'

const { CLIENT_URL } = process.env

const EMAIL_TEMPLATE_DIRECTORY = '../templates/email/ejs/'

const EMAIL_TEMPLATES = {
  INVITE: 'INVITE'
}
const EMAIL_TEMPLATE_FILES = {
  [EMAIL_TEMPLATES.INVITE]: 'invite.html'
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

  const htmlBody = `
  <div>${bodyText}</div>
`
  const textBody = bodyText

  await sendSingleRecipientEmail({ address, htmlBody, textBody, subject })
}

export default {
  sendInvitationEmail,
  sendPasswordChangeEmail
}
