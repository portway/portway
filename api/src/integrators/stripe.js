/* eslint-disable camelcase */
import Stripe from 'stripe'
import ono from 'ono'

const { STRIPE_HOOK_SECRET, STRIPE_SECRET } = process.env

const stripe = Stripe(STRIPE_SECRET)

const createCustomer = async function(body) {
  let customer

  try {
    customer = await stripe.customers.create(body)
  } catch (err) {
    if (err.type === 'StripeCardError') {
      throw ono(err, {
        code: 402,
        error: 'Invalid payment value',
        errorType: 'ValidationError',
        errorDetails: [
          {
            message: err.message,
            key: 'stripe'
          }
        ]
      })
    }
    throw ono(err, { code: 502 })
  }

  return customer
}

const getCustomer = async function(customerId) {
  let customer

  try {
    customer = await stripe.customers.retrieve(customerId)
  } catch (err) {
    throw ono(err, { code: 502 })
  }

  if (customer.subscriptions && customer.subscriptions.data.length > 1) {
    console.info(`WARNING: customer with stripeId ${customerId} has multiple subscriptions`)
  }

  return customer
}

const updateCustomer = async function(customerId, body) {
  let customer
  try {
    customer = await stripe.customers.update(customerId, body)
  } catch (err) {
    if (err.type === 'StripeCardError') {
      throw ono(err, {
        code: 402,
        error: 'Invalid payment value',
        errorType: 'ValidationError',
        errorDetails: [
          {
            message: err.message,
            key: 'stripe'
          }
        ]
      })
    }
    throw ono(err, { code: 502 })
  }

  return customer
}

const createOrUpdateSubscription = async function({ customerId, planId, seats, trialPeriodDays, subscriptionId, endTrial = false }) {
  let subscription
  try {
    if (subscriptionId) {
      const currentSubscription = await stripe.subscriptions.retrieve(subscriptionId)
      const options = {
        items: [
          {
            id: currentSubscription.items.data[0].id,
            plan: planId,
            quantity: seats
          }
        ],
        trial_period_days: trialPeriodDays
      }
      if (endTrial) {
        options.trial_end = 'now'
      }
      subscription = await stripe.subscriptions.update(subscriptionId, options)
    } else {
      subscription = await stripe.subscriptions.create({
        customer: customerId,
        items: [
          {
            plan: planId,
            quantity: seats
          }
        ],
        trial_period_days: trialPeriodDays
      })
    }
  } catch (err) {
    throw ono(err, { code: 502 })
  }

  return subscription
}

const constructWebhookEvent = function(body, signature) {
  return stripe.webhooks.constructEvent(body, signature, STRIPE_HOOK_SECRET)
}

const cancelSubscription = function(subscriptionId) {
  return stripe.subscriptions.del(subscriptionId)
}

const cancelSubscriptionAtPeriodEnd = function(subscriptionId) {
  return stripe.subscriptions.update(subscriptionId, { cancel_at_period_end: true })
}

// Removes customer + active subscriptions. Cannot be undone, but Stripe preserves history
const deleteCustomer = function(customerId) {
  return stripe.customers.del(customerId)
}


export default {
  createCustomer,
  getCustomer,
  updateCustomer,
  createOrUpdateSubscription,
  constructWebhookEvent,
  cancelSubscription,
  cancelSubscriptionAtPeriodEnd,
  deleteCustomer
}
