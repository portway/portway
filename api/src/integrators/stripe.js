import Stripe from 'stripe'
const stripe = Stripe(process.env.STRIPE_SECRET)

const createCustomer = async function({ email, token }) {
  const customer = await stripe.customers.create({
    email: email,
    source: token,
  })

  return customer
}

const createSubscription = async function({ customerId, planId }) {
  const subscription = stripe.subscriptions.create({
    customer: customerId,
    items: [{ plan: planId }],
  })

  return subscription
}

export default {
  createCustomer,
  createSubscription
}