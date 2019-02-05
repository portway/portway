import stripeIntegrator from '../integrators/stripe'

const subscribeCustomerToPlan = async function({ token, planId, email }) {
  console.log(token, planId, email)
  // 1 create customer in stripe - email and source ie token
  const customer = await stripeIntegrator.createCustomer({ email, token })

  // 2 TODO: save customer info to db - email and customer id, token too?

  // 3 subscribe customer to plan - customer id and plan id
  await stripeIntegrator.createSubscription({ customerId: customer.id, planId })
}

export default {
  subscribeCustomerToPlan
}