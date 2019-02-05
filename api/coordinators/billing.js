import stripeIntegrator from './integrators/stripe'

const subscribeCustomerToPlan = async function({ stripeToken, planId, email }) {
  // create customer in stripe - email and source ie token
  const { customerId } = await stripeIntegrator.createCustomer({ email, token })

  // TODO: save customer info to db - email and customer id, token too?

  // subscribe customer to plan - customer id and plan id
  await stripeIntegrator.createPlanSubscription({ customerId, planId })
}


export {
  subscribeCustomerToPlan
}