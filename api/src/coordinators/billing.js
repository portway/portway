import stripeIntegrator from '../integrators/stripe'
import BusinessOrganization from '../businesstime/organization'

const subscribeOrgToPlan = async function(token, planId, orgId) {
  // look up org owner and get email
  const org = await BusinessOrganization.findSanitizedById(orgId)
  const { stripeId } = org

  let customer

  // get or create customer
  if (!stripeId) {
    customer = await stripeIntegrator.retrieveCustomer(stripeId)
  } else {
    customer = await stripeIntegrator.createCustomer({ token })
    await BusinessOrganization.updateById(orgId, { stripeId: customer.id })
  }

  // 3 subscribe customer to plan - customer id and plan id
  await stripeIntegrator.createSubscription({ customerId: customer.id, planId })
}

export default {
  subscribeOrgToPlan
}
