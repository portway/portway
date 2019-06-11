import ono from 'ono'

import stripeIntegrator from '../integrators/stripe'
import BusinessOrganization from '../businesstime/organization'
import { pick } from '../libs/utils';
import { BILLING_PUBLIC_FIELDS, BILLING_SOURCE_PUBLIC_FIELDS } from '../constants/billingPublicFields'

const formatBilling = (billingObj) => {
  const publicBillingFields = pick(billingObj, BILLING_PUBLIC_FIELDS)
  return { ...publicBillingFields, source: pick(billingObj.sources.data[0], BILLING_SOURCE_PUBLIC_FIELDS) }
}

const subscribeOrgToPlan = async function(planId, orgId) {
  const org = await BusinessOrganization.findById(orgId)

  const customer = await stripeIntegrator.getCustomer(org.stripeId)

  if (!customer) {
    throw ono({ code: 404 }, `Cannot subscribe to plan, organization: ${orgId} does not have saved billing information`)
  }

  await stripeIntegrator.createSubscription({ customerId: customer.id, planId })
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

  return formatBilling(customer)
}

const getOrgBilling = async function(orgId) {
  const org = await BusinessOrganization.findById(orgId)

  if (!org) throw ono({ code: 404 }, `Could not fetch billing, organization not found with id ${orgId}`)

  // No billing information yet, return empty object
  if (!org.stripeId) return null

  const customer = await stripeIntegrator.getCustomer(org.stripeId)

  return formatBilling(customer)
}

export default {
  subscribeOrgToPlan,
  updateOrgBilling,
  getOrgBilling
}
