import BusinessOrganization from '../businesstime/organization'
import BusinessField from '../businesstime/field'
import BusinessDocumentVersion from '../businesstime/documentversion'
import BusinessDocument from '../businesstime/document'
import BusinessProject from '../businesstime/project'
import BusinessProjectToken from '../businesstime/projecttoken'
import BusinessUser from '../businesstime/user'
import BusinessProjectUser from '../businesstime/projectuser'
import stripeIntegrator from '../integrators/stripe'
import ono from 'ono'

const DAYS_AGO_FOR_DELETION = 0

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

const deleteCanceledOrg = async function(orgId) {
  const thirtyDays = 1000 * 60 * 60 * 24 * DAYS_AGO_FOR_DELETION
  const thirtyDaysAgo = Date.now() - thirtyDays
  const org = await BusinessOrganization.findById(orgId)

  // double check that the org canceledAt exists and happened at least 30 days ago
  if (!org.canceledAt) {
    throw ono({ code: 409 }, `Org ${orgId} cannot be deleted, must be canceled first`)
  }

  const canceledAtTimestamp = Date.parse(org.canceledAt)

  if (canceledAtTimestamp > thirtyDaysAgo) {
    throw ono({ code: 409 }, `Org ${orgId} cannot be deleted, was canceled less than ${DAYS_AGO_FOR_DELETION} days ago`)
  }

  await removeAllOrgData(orgId)
}

export default {
  updateById,
  removeAllOrgData,
  deleteCanceledOrg
}