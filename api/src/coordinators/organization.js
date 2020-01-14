import BusinessOrganization from '../businesstime/organization'
import BusinessField from '../businesstime/field'
import BusinessDocumentVersion from '../businesstime/documentversion'
import BusinessDocument from '../businesstime/document'
import BusinessProject from '../businesstime/project'
import BusinessProjectToken from '../businesstime/projecttoken'
import BusinessUser from '../businesstime/user'
import BusinessProjectUser from '../businesstime/projectuser'
import stripeIntegrator from '../integrators/stripe'

const updateById = async function(id, body) {
  const currentOrg = await BusinessOrganization.findById(id)
  const stripeCustomer = await stripeIntegrator.getCustomer(currentOrg.stripeId)

  const updatedOrganization = await BusinessOrganization.updateById(id, body)

  if (stripeCustomer && body.name && body.name !== currentOrg.name) {
    await stripeIntegrator.updateCustomer(stripeCustomer.id, { name: body.name })
  }

  return updatedOrganization
}

const removeAllOrgData = async function(orgId) {
  // remove fields
  await BusinessField.deleteAllForOrg(orgId)
  // remove documentVersions
  await BusinessDocumentVersion.deleteAllForOrg(orgId)
  // remove documents
  await BusinessDocument.deleteAllForOrg(orgId)
  // remove projects
  await BusinessProject.deleteAllForOrg(orgId)
  // remove project tokens
  await BusinessProjectToken.deleteAllForOrg(orgId)
  // remove users
  await BusinessUser.deleteAllForOrg(orgId)
  // remove project users
  await BusinessProjectUser.deleteAllForOrg(orgId)
  // TODO remove s3 data
  // remove org
  await BusinessOrganization.deleteById(orgId)
}

export default {
  updateById,
  removeAllOrgData
}