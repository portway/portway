import { sendSingleRecipientEmail } from '../integrators/email'
import BusinessOrganization from '../businesstime/organization'
import { SUPPORT_EMAIL } from '../constants/email'

const { CLIENT_URL } = process.env

async function sendInvitationEmail(email, token, orgId) {
  const organization = await BusinessOrganization.findSanitizedById(orgId)

  const linkUrl = `${CLIENT_URL}/sign-up/registration/complete?token=${token}`
  const invitedText = `You've been invited to join ${organization.name} on Portway!`
  const linkText = `Use the following link to complete your registration:`

  const htmlBody = `
  <H2>${invitedText}</h2>
  <H3>${linkText}</h3>
  <div>${linkUrl}</div>
`
  const textBody = `${invitedText}\n${linkText}\n${linkUrl}`

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
