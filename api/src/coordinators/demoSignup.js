// This coordinator is for creating demo accounts, aka free accounts
import ono from 'ono'

import BusinessUser from '../businesstime/user'
import BusinessOrganization from '../businesstime/organization'
import tokenIntegrator from '../integrators/token'
import passwordResetKey from '../libs/passwordResetKey'
import { ORGANIZATION_ROLE_IDS } from '../constants/roles'
import { sendSingleRecipientEmail } from '../integrators/email'
import stripeIntegrator from '../integrators/stripe'
import { PLANS, MULTI_USER_DEFAULT_SEAT_COUNT } from '../constants/plans'
import billingCoordinator from './billing'

const { CLIENT_URL } = process.env

async function createUsersAndOrganization(name, users) {
  const owner = users.find((user) => {
    return user.role === ORGANIZATION_ROLE_IDS.OWNER
  })

  if (!owner) {
    throw ono({ code: 400 }, 'Must set an owner for the demo account')
  }

  const organization = await BusinessOrganization.create({ name })

  const orgUsers = await Promise.all(
    users.map(async (user) => {
      const { name, email } = user
      const resetKey = passwordResetKey.generate()
      const businessUser = await BusinessUser.create({
        name,
        email,
        orgId: organization.id,
        orgRoleId: user.role,
        resetKey
      })
      businessUser.resetKey = resetKey
      return businessUser
    })
  )

  const customer = await stripeIntegrator.createCustomer({
    name: organization.name,
    description: `Customer for Org Owner: ${owner.email}`,
    email: owner.email
  })

  await BusinessOrganization.updateById(organization.id, {
    ownerId: owner.id,
    stripeId: customer.id
  })

  await billingCoordinator.createOrUpdateOrgSubscription({
    customerId: customer.id,
    planId: PLANS.MULTI_USER_FREE,
    orgId: organization.id,
    seats: MULTI_USER_DEFAULT_SEAT_COUNT
  })

  await Promise.all(
    orgUsers.map((user) => {
      const token = tokenIntegrator.generatePasswordResetToken(user.id, user.resetKey)
      const linkUrl = `${CLIENT_URL}/sign-up/registration/complete?token=${token}`

      const htmlBody = `
      <h2>Welcome to Portway!</h2>
      <p>We'd like to offer you a free account which you can claim by visiting the following link:</p>
      <p>${linkUrl}</p>
      <p>We hope you enjoy Portway and would value any feedback you'd like to share.</p>
    `
      const textBody = `Welcome to Portway! We'd like to offer you a free account you can claim here: ${linkUrl}`

      const subject = 'Free Account: Welcome to Portway!'

      return sendSingleRecipientEmail({ address: user.email, htmlBody, textBody, subject })
    })
  )
}

export default {
  createUsersAndOrganization
}
