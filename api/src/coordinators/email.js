import { sendSingleRecipientEmail } from '../integrators/email'
import BusinessOrganization from '../businesstime/organization'

const { CLIENT_URL } = process.env

async function sendInvitationEmail(email, token, orgId) {
  const organization = await BusinessOrganization.findSanitizedById(orgId)

  const linkUrl = `http://${CLIENT_URL}/sign-up/registration/complete?token=${token}`
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

export default {
  sendInvitationEmail
}
