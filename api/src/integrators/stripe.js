import Stripe from 'stripe'
import ono from 'ono'
const stripe = Stripe(process.env.STRIPE_SECRET)

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
    throw ono(err, { code: 500 })
  }

  return customer
}

const getCustomer = async function(customerId) {
  let customer

  try {
    customer = await stripe.customers.retrieve(customerId)
  } catch (err) {
    throw ono(err, { code: 500 })
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
    throw ono(err, { code: 500 })
  }

  return customer
}

const createSubscription = async function({ customerId, planId, trialPeriodDays }) {
  let subscription
  try {
    subscription = await stripe.subscriptions.create({
      customer: customerId,
      items: [{ plan: planId }],
      trial_period_days: trialPeriodDays
    })
  } catch (err) {
    throw ono(err, { code: 500 })
  }

  return subscription
}

export default {
  createCustomer,
  getCustomer,
  updateCustomer,
  createSubscription
}
