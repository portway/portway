import ono from 'ono'

import stripeIntegrator from '../integrators/stripe'
import BusinessOrganization from '../businesstime/organization'
import BusinessUser from '../businesstime/user'
import { pick } from '../libs/utils'
import { BILLING_PUBLIC_FIELDS } from '../constants/billingPublicFields'
import { PLANS, MULTI_USER_DEFAULT_SEAT_COUNT, STRIPE_STATUS, ORG_SUBSCRIPTION_STATUS } from '../constants/plans'
import { getOrgSubscriptionStatusFromStripeCustomer } from '../libs/orgSubscription'

const formatBilling = (customer, userCount) => {
  const publicBillingFields = pick(customer, BILLING_PUBLIC_FIELDS)
  const billingSource = customer.sources.data[0]
  let source = null
  if (billingSource) {
    source = {
      addressCity: billingSource.address_city,
      addressCountry: billingSource.addressCountry,
      addressLine1: billingSource.address_line1,
      addressLine2: billingSource.address_line2,
      addressState: billingSource.address_state,
      addressZip: billingSource.address_zip,
      brand: billingSource.brand,
      expMonth: billingSource.exp_month,
      expYear: billingSource.exp_year,
      last4: billingSource.last4,
      name: billingSource.name
    }
  }

  const billingSubscription = customer.subscriptions.data[0]

  const subscription = {
    status: null,
    planId: null,
    billingCycleAnchor: null,
    cancelAt: null,
    currentPeriodEnd: null,
    trialEnd: null,
    totalSeats: null,
    usedSeats: null,
    flatCost: null,
    includedSeats: null,
    additionalSeatCost: null
  }

  if (billingSubscription) {
    subscription.status = billingSubscription.status
    subscription.planId = billingSubscription.plan.id
    subscription.billingCycleAnchor = billingSubscription.billing_cycle_anchor
    subscription.cancelAt = billingSubscription.cancel_at
    subscription.currentPeriodEnd = billingSubscription.current_period_end
    subscription.trialEnd = billingSubscription.trialEnd
    subscription.totalSeats = billingSubscription.items.data[0].quantity
    subscription.usedSeats = userCount

    if (billingSubscription.plan.id === PLANS.SINGLE_USER) {
      subscription.flatCost = billingSubscription.plan.amount
      subscription.includedSeats = 1
    }

    if (billingSubscription.plan.id === PLANS.MULTI_USER) {
      subscription.flatCost = billingSubscription.plan.tiers[0].flat_amount
      subscription.includedSeats = billingSubscription.plan.tiers[0].up_to
      subscription.additionalSeatCost = billingSubscription.plan.tiers[1].unit_amount
    }
  }

  return { ...publicBillingFields, source, subscription }
}

const subscribeOrgToPlan = async function(planId, orgId) {
  let seats

  const billingError = ono({ code: 409, publicMessage: 'No billing information for organization' }, `Cannot subscribe to plan, organization: ${orgId} does not have saved billing information`)

  const org = await BusinessOrganization.findById(orgId)
  if (!org.stripeId) {
    throw billingError
  }

  const customer = await stripeIntegrator.getCustomer(org.stripeId)

  if (!customer) {
    throw billingError
  }

  const currentSubscription = customer.subscriptions.data[0]
  const subscriptionId = currentSubscription && currentSubscription.id
  const currentPlanId = currentSubscription && currentSubscription.plan.id

  if (planId === PLANS.SINGLE_USER && currentPlanId === PLANS.MULTI_USER) {
    const message = 'Cannot downgrade from multi user to single user plan'
    throw ono({ code: 409, errorDetails: [{ key: 'plan', message }], publicMessage: message }, message)
  }

  //nothing is changing, return success and move on without updating stripe
  if (planId === currentPlanId) {
    return
  }

  if (planId === PLANS.MULTI_USER) {
    seats = MULTI_USER_DEFAULT_SEAT_COUNT
  }

  await billingCoordinator.createOrUpdateOrgSubscription({ customerId: customer.id, planId, seats, subscriptionId, orgId })
}

const updatePlanSeats = async function(seats, orgId) {
  const billingError = ono({ code: 409, errorDetails: [{ key: 'seats', message: 'No billing information for organization' }] }, `Cannot update plan seats, organization: ${orgId} does not have saved billing information`)

  const org = await BusinessOrganization.findById(orgId)
  if (!org.stripeId) {
    throw billingError
  }

  const customer = await stripeIntegrator.getCustomer(org.stripeId)

  if (!customer) {
    throw billingError
  }

  const currentSubscription = customer.subscriptions.data[0]

  if (!currentSubscription) {
    const publicMessage = 'No Subscription: Organization must be subscribed to a plan to update seat count'
    throw ono({ code: 409, errorDetails: [{ key: 'seats', publicMessage }] }, publicMessage)
  }

  const subscriptionId = currentSubscription.id
  const currentSeats = currentSubscription.items.data[0].quantity
  const currentPlanId = currentSubscription.plan.id

  if (currentPlanId === PLANS.SINGLE_USER) {
    const publicMessage = 'Cannot set seats on a single user plan'
    throw ono({ code: 409, errorDetails: [{ key: 'seats', publicMessage }] }, publicMessage)
  }

  //nothing is changing, return success and move on without updating stripe
  if (seats === currentSeats) {
    return currentSeats
  }

  const userCount = await BusinessUser.countAll(orgId)

  if (userCount > seats) {
    const publicMessage = `You currently have ${userCount} users, you cannot have less seats than users`
    throw ono({ code: 409, errorDetails: [{ key: 'seats', publicMessage }] }, publicMessage)
  }

  const subscription = await billingCoordinator.createOrUpdateOrgSubscription({ customerId: customer.id, seats, subscriptionId, orgId })

  return subscription.items.data[0].quantity
}

const updateOrgBilling = async function(token, orgId) {
  const org = await BusinessOrganization.findById(orgId)

  if (!org) throw ono({ code: 404 }, `Could not update billing, organization not found with id ${orgId}`)

  let customer

  if (org.stripeId) {
    customer = await stripeIntegrator.updateCustomer(org.stripeId, { source: token })
  } else {
    customer = await stripeIntegrator.createCustomer({ source: token, name: org.name })
    await BusinessOrganization.updateById(orgId, { stripeId: customer.id })
  }

  const currentSubscription = customer.subscriptions.data[0]

  if (!currentSubscription) {
    // Somehow the user doesn't have a subscription yet, they now have billing info saved, give them a single user one
    await billingCoordinator.createOrUpdateOrgSubscription({ customerId: customer.id, planId: PLANS.SINGLE_USER, orgId })
  } else if (currentSubscription.status !== STRIPE_STATUS.ACTIVE) {
    // User is trialing, or has a payment issue, re-subscribe them to their current plan
    const currentPlan = currentSubscription.plan.id
    await billingCoordinator.createOrUpdateOrgSubscription({ customerId: customer.id, planId: currentPlan, subscriptionId: currentSubscription.id, orgId })
  }

  // might be adding valid card info to fix PAST_DUE or INACTIVE status, reset cached data on org
  await billingCoordinator.fetchCustomerAndSetSubscriptionDataOnOrg(orgId)

  return billingCoordinator.getOrgBilling(orgId)
}

const getOrgBilling = async function(orgId) {
  const org = await BusinessOrganization.findById(orgId)

  if (!org) throw ono({ code: 404 }, `Could not fetch billing, organization not found with id ${orgId}`)

  // No billing information yet, return empty object
  if (!org.stripeId) return {}

  const customer = await stripeIntegrator.getCustomer(org.stripeId)

  const userCount = await BusinessUser.countAll(orgId)

  return formatBilling(customer, userCount)
}

const createOrUpdateOrgSubscription = async function({ customerId, planId, trialPeriodDays, seats, subscriptionId, orgId }) {
  const endTrial = planId === PLANS.MULTI_USER

  const updatedSubscription = await stripeIntegrator.createOrUpdateSubscription({ customerId, planId, trialPeriodDays, seats, subscriptionId, endTrial })

  await billingCoordinator.fetchCustomerAndSetSubscriptionDataOnOrg(orgId)

  return updatedSubscription
}

const cancelAccount = async function(orgId) {
  const billingError = ono({ code: 409, errorDetails: [{ key: 'seats', message: 'No billing information for organization' }] }, `Cannot cancel subscription, organization: ${orgId} does not have saved billing information`)

  const org = await BusinessOrganization.findById(orgId)
  if (!org.stripeId) {
    throw billingError
  }

  const customer = await stripeIntegrator.getCustomer(org.stripeId)

  if (!customer) {
    throw billingError
  }

  const currentSubscription = customer.subscriptions.data[0]

  if (!currentSubscription) {
    const publicMessage = 'Organization does not have a subscription to cancel'
    throw ono({ code: 409, errorDetails: [{ key: 'seats', publicMessage }] }, publicMessage)
  }

  const orgSubscriptionStatus = getOrgSubscriptionStatusFromStripeCustomer(customer)

  if (orgSubscriptionStatus === ORG_SUBSCRIPTION_STATUS.TRIALING) {
    // still in trial, but not pending active, cancel immediately
    await stripeIntegrator.cancelSubscription(currentSubscription.id)
  } else {
    // for all other subscription statuses wait until billing period ends to cancel
    await stripeIntegrator.cancelSubscriptionAtPeriodEnd(currentSubscription.id)
  }

  await billingCoordinator.fetchCustomerAndSetSubscriptionDataOnOrg(orgId)
}

const fetchCustomerAndSetSubscriptionDataOnOrg = async function(orgId) {
  const org = await BusinessOrganization.findById(orgId)
  const customer = await stripeIntegrator.getCustomer(org.stripeId)
  const subscriptionStatus = getOrgSubscriptionStatusFromStripeCustomer(customer)

  const orgUpdateData = { subscriptionStatus }

  // The org is getting inactive status, but this could potentially happen multiple times depending on how hooks are set up
  // so only set the canceledAt date on the org if it doesn't already exist
  if (subscriptionStatus === ORG_SUBSCRIPTION_STATUS.INACTIVE && !org.canceledAt) {
    orgUpdateData.canceledAt = Date.now()
  }

  const plan = customer.subscriptions.data[0] && customer.subscriptions.data[0].plan.id

  // if the customer is subscribed to a plan, go ahead and update it to the current value
  if (plan) {
    orgUpdateData.plan = plan
  }

  await BusinessOrganization.updateById(orgId, orgUpdateData)
}

const billingCoordinator = {
  subscribeOrgToPlan,
  updatePlanSeats,
  updateOrgBilling,
  getOrgBilling,
  createOrUpdateOrgSubscription,
  cancelAccount,
  fetchCustomerAndSetSubscriptionDataOnOrg
}

export default billingCoordinator
