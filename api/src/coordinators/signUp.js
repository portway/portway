import BusinessUser from '../businesstime/user'
import BusinessOrganization from '../businesstime/organization'
import tokenIntegrator from '../integrators/token'
import { ORGANIZATION_ROLE_IDS } from '../constants/roles'
import emailCoordinator from './email'
import stripeIntegrator from '../integrators/stripe'
import { PLANS, TRIAL_PERIOD_DAYS } from '../constants/plans'
import billingCoordinator from './billing'
import introCoordinator from './intro'
import userCoordinator from './user'
import ono from 'ono'
import slackIntegrator from '../integrators/slack'
import logger from '../integrators/logger'
import { LOG_LEVELS } from '../constants/logging'

const { CLIENT_URL } = process.env

/**
 * 
 * @param {String} name the user's name, all one string in whatever format they choose
 * @param {String} email the user's email address. Must be valid email to verify and use account
 * @param {String} source (optional) a string indicating where the user signed up from
 */
async function createUserAndOrganization(name, email, source) {
  const existingUser = await BusinessUser.findByEmail(email)

  if (existingUser) {
    throw ono({ code: 409 }, 'There is already a user with this email address')
  }

  const organizationName = `${name}'s Organization`

  const newOrg = { name: organizationName }
  if (source) {
    newOrg.source = source
  }
  const organization = await BusinessOrganization.create(newOrg)

  const createdUser = await userCoordinator.createPendingUser(
    email, name, organization.id, ORGANIZATION_ROLE_IDS.OWNER
  )

  const customer = await stripeIntegrator.createCustomer({ name: organization.name, description: `Customer for Org Owner: ${email}`, email })

  await BusinessOrganization.updateById(organization.id, {
    ownerId: createdUser.id,
    stripeId: customer.id
  })

  try {
    // Letting this happen in the background. Should occur before user verifies their email
    // and if there's an error we don't want it to prevent signup. Note this has to occur after
    // the ownerId has been set on the org!
    introCoordinator.copyIntroProjectToOrg(organization.id)
  } catch (e) {
    logger(LOG_LEVELS.ERROR, e)
  }

  await billingCoordinator.createOrUpdateOrgSubscription({
    customerId: customer.id,
    planId: PLANS.PER_USER,
    trialPeriodDays: TRIAL_PERIOD_DAYS,
    orgId: organization.id
  })

  const token = tokenIntegrator.generatePasswordResetToken(createdUser.id, createdUser.resetKey)
  const linkUrl = `${CLIENT_URL}/sign-up/registration/complete?token=${token}`
  await emailCoordinator.sendSignupVerification(linkUrl, createdUser.email)

  // not awaiting this, sends a notification to slack channel
  const fromSource = source ? ` from ${source}` : ''
  slackIntegrator.sendNotification(`${email} has signed up for Portway${fromSource}`)
}

export default {
  createUserAndOrganization
}
