import BusinessUser from '../businesstime/user'
import BusinessOrganization from '../businesstime/organization'
import tokenIntegrator from '../integrators/token'
import passwordResetKey from '../libs/passwordResetKey'
import { ORGANIZATION_ROLE_IDS } from '../constants/roles'
import { sendSingleRecipientEmail } from '../integrators/email'

async function createUserAndOrganization(name, email) {
  const organizationName = `${name}'s Organization`
  const organization = await BusinessOrganization.create({ name: organizationName })
  const resetKey = passwordResetKey.generate()

  const createdUser = await BusinessUser.create({
    name,
    email,
    orgId: organization.id,
    orgRoleId: ORGANIZATION_ROLE_IDS.OWNER,
    resetKey
  })

  await BusinessOrganization.updateById(organization.id, { ownerId: createdUser.id })

  const token = tokenIntegrator.generatePasswordResetToken(createdUser.id, resetKey)

  // TODO: need to set the url from ENV to allow production emailing when we have that set up
  const linkUrl = `http://localhost:3000/sign-up/registration/complete?token=${token}`

  const htmlBody = `
    <H2>Here is your link to finish signing-up for Project Danger:</h2
    <div>${linkUrl}</div>
  `
  const textBody = `Here is your link to finish signing-up for Project Danger: ${linkUrl}`


  await sendSingleRecipientEmail({ address: createdUser.email, htmlBody, textBody })
}

export default {
  createUserAndOrganization
}
