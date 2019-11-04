import ono from 'ono'

import stripeIntegrator from '../integrators/stripe'
import BusinessOrganization from '../businesstime/organization'
import { pick } from '../libs/utils'
import { BILLING_PUBLIC_FIELDS } from '../constants/billingPublicFields'
import { PLANS, MULTI_USER_DEFAULT_SEAT_COUNT, STRIPE_STATUS } from '../constants/plans'

const formatBilling = (customer) => {
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
    flatCost: null,
    includedSeats: null,
    additionalSeatCost: null
  }

  if (billingSubscription) {
    subscription.status = billingSubscription.status
    subscription.planId = billingSubscription.plan.id
    subscription.billingCycleAnchor = billingSubscription.billing_cycle_anchor
    subscription.currentPeriodEnd = billingSubscription.current_period_end
    subscription.trialEnd = billingSubscription.trialEnd
    subscription.currentSeats = billingSubscription.items.data[0].quantity

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
    throw ono({ code: 409, publicMessage: message }, message)
  }

  //nothing is changing, return success and move on without updating stripe
  if (planId === currentPlanId) {
    return
  }

  if (planId === PLANS.MULTI_USER) {
    seats = MULTI_USER_DEFAULT_SEAT_COUNT
  }

  await createOrcreateOrUpdateOrgSubscription({ customerId: customer.id, planId, seats, subscriptionId, orgId })
}

const updatePlanSeats = async function(seats, orgId) {
  const billingError = ono({ code: 409, publicMessage: 'No billing information for organization' }, `Cannot update plan seats, organization: ${orgId} does not have saved billing information`)

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
    throw ono({ code: 409, publicMessage: 'No Subscription: Organization must be subscribed to a plan to update seat count' })
  }

  const subscriptionId = currentSubscription.id
  const currentSeats = currentSubscription.items.data[0].quantity
  const currentPlanId = currentSubscription.plan.id

  if (currentPlanId === PLANS.SINGLE_USER) {
    const message = 'Cannot set seats on a single user plan'
    throw ono({ code: 409, publicMessage: message }, message)
  }

  //nothing is changing, return success and move on without updating stripe
  if (seats === currentSeats) {
    return
  }

  const subscription = await stripeIntegrator.createOrUpdateSubscription({ customerId: customer.id, seats, subscriptionId })

  await BusinessOrganization.updateById(orgId, { subscriptionStatus: subscription.status })
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
    await createOrUpdateOrgSubscription({ customerId: customer.id, planId: PLANS.SINGLE_USER, orgId })
  } else if (currentSubscription.status !== STRIPE_STATUS.ACTIVE) {
    // User is trialing, or has a payment issue, re-subscribe them to their current plan
    const currentPlan = currentSubscription.plan.id
    await createOrUpdateOrgSubscription({ customerId: customer.id, planId: currentPlan, orgId })
  }

  // refetch customer with current billing and subscription information
  const updatedCustomer = await stripeIntegrator.getCustomer(customer.id)

  return formatBilling(updatedCustomer)
}

const getOrgBilling = async function(orgId) {
  const org = await BusinessOrganization.findById(orgId)

  if (!org) throw ono({ code: 404 }, `Could not fetch billing, organization not found with id ${orgId}`)

  // No billing information yet, return empty object
  if (!org.stripeId) return {}

  const customer = await stripeIntegrator.getCustomer(org.stripeId)

  return formatBilling(customer)
}

const createOrUpdateOrgSubscription = async function({ customerId, planId, trialPeriodDays, seats, subscriptionId, orgId }) {
  const updatedSubscription = await stripeIntegrator.createOrUpdateSubscription({ customerId, planId, trialPeriodDays, seats, subscriptionId })

  const orgUpdateObj = {
    subscriptionStatus: updatedSubscription.status
  }

  // only update the cached plan id on the org if we're actually changing that value
  if (planId) {
    orgUpdateObj.plan = planId
  }

  await BusinessOrganization.updateById(orgId, orgUpdateObj)
}

export default {
  subscribeOrgToPlan,
  updatePlanSeats,
  updateOrgBilling,
  getOrgBilling,
  createOrUpdateOrgSubscription
}
