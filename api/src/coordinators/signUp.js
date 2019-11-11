import BusinessUser from '../businesstime/user'
import BusinessOrganization from '../businesstime/organization'
import tokenIntegrator from '../integrators/token'
import passwordResetKey from '../libs/passwordResetKey'
import { ORGANIZATION_ROLE_IDS } from '../constants/roles'
import { sendSingleRecipientEmail } from '../integrators/email'
import stripeIntegrator from '../integrators/stripe'
import { PLANS, TRIAL_PERIOD_DAYS } from '../constants/plans'
import billingCoordinator from './billing'

const { CLIENT_URL } = process.env

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

  const customer = await stripeIntegrator.createCustomer({ name: organization.name, description: `Customer for Org Owner: ${email}` })
  await billingCoordinator.createOrUpdateOrgSubscription({
    customerId: customer.id,
    planId: PLANS.SINGLE_USER,
    trialPeriodDays: TRIAL_PERIOD_DAYS,
    orgId: organization.id
  })

  await BusinessOrganization.updateById(organization.id, {
    ownerId: createdUser.id,
    stripeId: customer.id
  })

  const token = tokenIntegrator.generatePasswordResetToken(createdUser.id, resetKey)

  const linkUrl = `http://${CLIENT_URL}/sign-up/registration/complete?token=${token}`

  const htmlBody = `
    <H2>Here's your link to finish signing up for Portway:</h2>
    <div>${linkUrl}</div>
  `
  const textBody = `Here is your link to finish signing-up for Portway: ${linkUrl}`

  const subject = 'Portway email confirmation'

  await sendSingleRecipientEmail({ address: createdUser.email, htmlBody, textBody, subject })
}

export default {
  createUserAndOrganization
}
