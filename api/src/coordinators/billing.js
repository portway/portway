import ono from 'ono'

import stripeIntegrator from '../integrators/stripe'
import BusinessOrganization from '../businesstime/organization'
import BusinessUser from '../businesstime/user'
import { pick } from '../libs/utils'
import { BILLING_PUBLIC_FIELDS } from '../constants/billingPublicFields'
import {
  PLANS,
  STRIPE_STATUS,
  ORG_SUBSCRIPTION_STATUS,
  STRIPE_PLAN_ID_TO_PORTWAY_PLAN_MAP,
  PORTWAY_PLAN_TO_STRIPE_PLAN_ID_MAP,
  MULTI_USER_PLANS,
  SINGLE_USER_PLANS,
  SUBSCRIBABLE_PLANS
} from '../constants/plans'
import { getOrgSubscriptionStatusFromStripeCustomer } from '../libs/orgSubscription'
import slackIntegrator from '../integrators/slack'
import logger from '../integrators/logger'
import { LOG_LEVELS } from '../constants/logging'

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
  const portwayPlanId = billingSubscription ? STRIPE_PLAN_ID_TO_PORTWAY_PLAN_MAP[billingSubscription.plan.id] : null

  const subscription = {
    status: null,
    plan: null,
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
    subscription.billingCycleAnchor = billingSubscription.billing_cycle_anchor
    subscription.cancelAt = billingSubscription.cancel_at
    subscription.currentPeriodEnd = billingSubscription.current_period_end
    subscription.trialEnd = billingSubscription.trial_end
    subscription.totalSeats = billingSubscription.items.data[0].quantity
    subscription.usedSeats = userCount

    if (portwayPlanId === PLANS.SINGLE_USER) {
      subscription.plan = PLANS.SINGLE_USER
      subscription.flatCost = billingSubscription.plan.amount
      subscription.includedSeats = 1
    }

    // TODO: delete, after we verify no one is on MULTI_USER plan
    // if (billingSubscription.plan.id === PLANS.MULTI_USER) {
    //   subscription.plan = PLANS.MULTI_USER
    //   subscription.flatCost = billingSubscription.plan.tiers[0].flat_amount
    //   subscription.includedSeats = billingSubscription.plan.tiers[0].up_to
    //   subscription.additionalSeatCost = billingSubscription.plan.tiers[1].unit_amount
    // }

    if (portwayPlanId === PLANS.PER_USER) {
      subscription.plan = PLANS.PER_USER
      subscription.flatCost = billingSubscription.plan.tiers[0].flat_amount
      subscription.includedSeats = billingSubscription.plan.tiers[0].up_to
      subscription.additionalSeatCost = billingSubscription.plan.tiers[1].unit_amount
    }
  }

  return { ...publicBillingFields, source, subscription }
}

const subscribeOrgToPlan = async function(planId, orgId) {
  let seats

  if (!SUBSCRIBABLE_PLANS.includes(planId)) {
    throw ono({ code: 409, publicMessage: 'This plan is no longer active' }, `Cannot subscribe org: ${orgId} to plan, ${planId} is not subscribable`)
  }

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
  // this is coming back as an environment dependent stripe plan id, convert to portway plan type
  const currentPlanId = currentSubscription && STRIPE_PLAN_ID_TO_PORTWAY_PLAN_MAP[currentSubscription.plan.id]

  if (SINGLE_USER_PLANS.includes(planId) && MULTI_USER_PLANS.includes(currentPlanId)) {
    const message = 'Cannot downgrade from multi user to single user plan'
    throw ono({ code: 409, publicMessage: message, errorDetails: [{ key: 'plan', message }] }, message)
  }

  //nothing is changing, return success and move on without updating stripe
  if (planId === currentPlanId) {
    return
  }

  // TODO: delete, no longer allowing subscription to multi user plans
  // if (planId === PLANS.MULTI_USER) {
  //   seats = MULTI_USER_DEFAULT_SEAT_COUNT
  // }

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
    throw ono({ code: 409, errorDetails: [{ key: 'seats', message: publicMessage }] }, publicMessage)
  }

  const subscriptionId = currentSubscription.id
  const currentSeats = currentSubscription.items.data[0].quantity
  const currentPlanId = STRIPE_PLAN_ID_TO_PORTWAY_PLAN_MAP[currentSubscription.plan.id]
  const orgSubscriptionStatus = getOrgSubscriptionStatusFromStripeCustomer(customer)

  if (orgSubscriptionStatus === ORG_SUBSCRIPTION_STATUS.TRIALING) {
    const publicMessage = 'Cannot add seats on a trial plan'
    throw ono({ code: 409, errorDetails: [{ key: 'seats', message: publicMessage }] }, publicMessage)
  }

  if (currentPlanId === PLANS.MULTI_USER_FREE) {
    const publicMessage = 'Cannot add seats on a free plan'
    throw ono({ code: 409, errorDetails: [{ key: 'seats', message: publicMessage }] }, publicMessage)
  }

  //nothing is changing, return success and move on without updating stripe
  if (seats === currentSeats) {
    return currentSeats
  }

  const userCount = await BusinessUser.countAll(orgId)

  if (userCount > seats) {
    const publicMessage = `You currently have ${userCount} users, you cannot have less seats than users`
    throw ono({ code: 409, errorDetails: [{ key: 'seats', message: publicMessage }] }, publicMessage)
  }

  // default to false for ending the trial
  let endTrial = false

  // they're on a per user or single user plan (the only two plans they could possibly have for a trial)
  // but might be trialing, if they're upgrading to more than 1 user,
  // go ahead and end the trial
  if (
    (currentPlanId === PLANS.PER_USER || currentPlanId === PLANS.SINGLE_USER)
    && seats > 1) {
    endTrial = true
  }

  // everyone gets on the per user plan as soon as they add another user
  // TODO: remove when we no longer have any SINGLE_USER plan users
  const plan = PLANS.PER_USER

  const subscription = await billingCoordinator.createOrUpdateOrgSubscription({ planId: plan, customerId: customer.id, seats, subscriptionId, orgId, endTrial })

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
    // Somehow the user doesn't have a subscription yet, they now have billing info saved, give them a per user one
    await billingCoordinator.createOrUpdateOrgSubscription({ customerId: customer.id, planId: PLANS.PER_USER, orgId })
  } else if (currentSubscription.status !== STRIPE_STATUS.ACTIVE) {
    // User is trialing, or has a payment issue, re-subscribe them to their current plan
    const currentPlan = STRIPE_PLAN_ID_TO_PORTWAY_PLAN_MAP[currentSubscription.plan.id]
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

const createOrUpdateOrgSubscription = async function({ customerId, planId, trialPeriodDays, seats, subscriptionId, orgId, endTrial = false }) {
  const stripePlanId = PORTWAY_PLAN_TO_STRIPE_PLAN_ID_MAP[planId]

  const updatedSubscription = await stripeIntegrator.createOrUpdateSubscription({ customerId, planId: stripePlanId, trialPeriodDays, seats, subscriptionId, endTrial })

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
    throw ono({ code: 409, errorDetails: [{ key: 'seats', message: publicMessage }] }, publicMessage)
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

  const orgUpdateData = {}

  if (subscriptionStatus !== org.subscriptionStatus) {
    orgUpdateData.subscriptionStatus = subscriptionStatus
    // log subscription changes
    logger(LOG_LEVELS.INFO, { type: 'org subscription status update', message: `The subscription status for organization ${org.name} (${org.id}) has changed from ${org.subscriptionStatus} to ${subscriptionStatus}` })
  }

  // The org is getting inactive status, but this could potentially happen multiple times depending on how hooks are set up
  // so only set the canceledAt date on the org if it doesn't already exist
  if (subscriptionStatus === ORG_SUBSCRIPTION_STATUS.INACTIVE && !org.canceledAt) {
    orgUpdateData.canceledAt = Date.now()

    // not awaiting this, sends a notification to slack channel
    slackIntegrator.sendNotification(`Organization: ${org.name} has canceled their Portway account`)
  }

  const subscription = customer.subscriptions.data[0]
  const plan = subscription && subscription.plan.id

  // if the customer is subscribed to a plan, go ahead and update it to the current value
  // we want the publicly visible portway plan string here, not the plan id from stripe
  if (plan) {
    orgUpdateData.plan = STRIPE_PLAN_ID_TO_PORTWAY_PLAN_MAP[plan]
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
