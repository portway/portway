import Stripe from 'stripe'
const stripe = Stripe(process.env.STRIPE_SECRET)

const createCustomer = async function(body) {
  const customer = await stripe.customers.create(body)

  return customer
}

const updateCustomer = async function(customerId, body) {
  const customer = await stripe.customers.update(customerId, body)

  return customer
}

const createSubscription = async function(customerId, planId) {
  const subscription = stripe.subscriptions.create({
    customer: customerId,
    items: [{ plan: planId }]
  })

  return subscription
}

export default {
  createCustomer,
  updateCustomer,
  createSubscription
}
