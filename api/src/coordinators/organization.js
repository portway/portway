import BusinessOrganization from '../businesstime/organization'
import stripeIntegrator from '../integrators/stripe'

const updateById = async function(id, body) {
  const currentOrg = await BusinessOrganization.findById(id)
  const stripeCustomer = await stripeIntegrator.getCustomer(currentOrg.stripeId)

  await BusinessOrganization.updateById(id, body)

  if (stripeCustomer && body.name && body.name !== currentOrg.name) {
    await stripeIntegrator.updateCustomer(stripeCustomer.id, { name: body.name })
  }
}

export default {
  updateById
}