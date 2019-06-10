import ono from 'ono'

import stripeIntegrator from '../integrators/stripe'
import BusinessOrganization from '../businesstime/organization'

const subscribeOrgToPlan = async function(planId, orgId) {
  const org = await BusinessOrganization.findSanitizedById(orgId)

  const customer = await stripeIntegrator.retrieveCustomer(org.stripeId)

  if (!customer) {
    throw ono({ code: 404 }, `Cannot subscribe to plan, organization: ${orgId} does not have saved billing information`)
  }

  await stripeIntegrator.createSubscription({ customerId: customer.id, planId })
}

const updateOrgBilling = async function(token, orgId) {
  const org = await BusinessOrganization.findSanitizedById(orgId)

  let customer

  if (org.stripeId) {
    customer = await stripeIntegrator.updateCustomer(org.stripeId, { source: token })
  } else {
    customer = await stripeIntegrator.createCustomer({ source: token, name: org.name })
    await BusinessOrganization.updateById(orgId, { stripeId: customer.id })
  }

  return customer
}

export default {
  subscribeOrgToPlan,
  updateOrgBilling
}
