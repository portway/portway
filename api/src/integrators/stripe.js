import Stripe from 'stripe'
import ono from 'ono'
const stripe = Stripe(process.env.STRIPE_SECRET)

const createCustomer = async function(body) {
  let customer

  try {
    customer = await stripe.customers.create(body)
  } catch (err) {
    if (err.type === 'StripeCardError') {
      throw ono(err, { code: 402, errorType: err.code, publicMessage: err.message })
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
      throw ono(err, { code: 402, errorType: err.code, publicMessage: err.message })
    }
    throw ono(err, { code: 500 })
  }

  return customer
}

const createSubscription = async function(customerId, planId) {
  let subscription
  try {
    subscription = stripe.subscriptions.create({
      customer: customerId,
      items: [{ plan: planId }]
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
