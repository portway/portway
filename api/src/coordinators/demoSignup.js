// This coordinator is for creating demo accounts, aka free accounts
import ono from 'ono'

import BusinessOrganization from '../businesstime/organization'
import tokenIntegrator from '../integrators/token'
import { ORGANIZATION_ROLE_IDS } from '../constants/roles'
import userCoordinator from './user'
import emailCoordinator from './email'
import stripeIntegrator from '../integrators/stripe'
import { PLANS, MULTI_USER_DEFAULT_SEAT_COUNT } from '../constants/plans'
import billingCoordinator from './billing'

const { CLIENT_URL } = process.env

async function createUsersAndOrganization(name, users) {
  const owners = users.filter((user) => {
    return user.role === ORGANIZATION_ROLE_IDS.OWNER
  })

  if (owners.length > 1) {
    throw ono({ code: 400, expose: true }, 'Organization can only have 1 owner')
  }

  const owner = owners[0]

  if (!owner) {
    throw ono({ code: 400, expose: true }, 'Must set an owner for the demo account')
  }

  const organization = await BusinessOrganization.create({ name })

  const orgUsers = await Promise.all(
    users.map((user) => {
      return userCoordinator.createPendingUser(user.email, user.name, organization.id, user.role)
    })
  )

  const customer = await stripeIntegrator.createCustomer({
    name: organization.name,
    description: `Customer for Org Owner: ${owner.email}`,
    email: owner.email
  })

  const businessOwner = orgUsers.find((user) => {
    return user.orgRoleId === ORGANIZATION_ROLE_IDS.OWNER
  })

  await BusinessOrganization.updateById(organization.id, {
    ownerId: businessOwner.id,
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
      const token = tokenIntegrator.generateAccountInviteToken(user.id, user.resetKey)
      const linkUrl = `${CLIENT_URL}/sign-up/registration/complete?token=${token}`
      return emailCoordinator.sendFreeAccountInvite(linkUrl, user.email)
    })
  )
}

export default {
  createUsersAndOrganization
}
