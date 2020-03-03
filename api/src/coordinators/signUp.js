import BusinessUser from '../businesstime/user'
import BusinessOrganization from '../businesstime/organization'
import tokenIntegrator from '../integrators/token'
import passwordResetKey from '../libs/passwordResetKey'
import { ORGANIZATION_ROLE_IDS } from '../constants/roles'
import emailCoordinator from './email'
import stripeIntegrator from '../integrators/stripe'
import { PLANS, TRIAL_PERIOD_DAYS } from '../constants/plans'
import billingCoordinator from './billing'
import introCoordinator from './intro'
import ono from 'ono'
import slackIntegrator from '../integrators/slack'

const { CLIENT_URL } = process.env

async function createUserAndOrganization(name, email) {
  const existingUser = await BusinessUser.findByEmail(email)

  if (existingUser) {
    throw ono({ code: 409 }, 'There is already a user with this email address')
  }

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

  const customer = await stripeIntegrator.createCustomer({ name: organization.name, description: `Customer for Org Owner: ${email}`, email })

  await BusinessOrganization.updateById(organization.id, {
    ownerId: createdUser.id,
    stripeId: customer.id
  })

  // Letting this happen in the background. Should occur before user verifies their email
  // and if there's an error we don't want it to prevent signup. Note this has to occur after
  // the ownerId has been set on the org!
  introCoordinator.copyIntroProjectToOrg(organization.id)

  await billingCoordinator.createOrUpdateOrgSubscription({
    customerId: customer.id,
    planId: PLANS.SINGLE_USER,
    trialPeriodDays: TRIAL_PERIOD_DAYS,
    orgId: organization.id
  })

  const token = tokenIntegrator.generatePasswordResetToken(createdUser.id, resetKey)

  const linkUrl = `${CLIENT_URL}/sign-up/registration/complete?token=${token}`

  await emailCoordinator.sendSignupVerification(linkUrl, createdUser.email)

  // not awaiting this, sends a notification to slack channel
  slackIntegrator.sendNotification(`${email} has signed up for Portway`)
}

export default {
  createUserAndOrganization
}
