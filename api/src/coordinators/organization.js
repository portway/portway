import BusinessOrganization from '../businesstime/organization'
import BusinessField from '../businesstime/field'
import BusinessDocumentVersion from '../businesstime/documentversion'
import BusinessDocument from '../businesstime/document'
import BusinessProject from '../businesstime/project'
import BusinessProjectToken from '../businesstime/projecttoken'
import BusinessUser from '../businesstime/user'
import BusinessProjectUser from '../businesstime/projectuser'
import BusinessResourceUsage from '../businesstime/resourceusage'
import BusinessWebhook from '../businesstime/webhook'
import stripeIntegrator from '../integrators/stripe'
import { deleteOrgDirectory } from '../integrators/s3'
import ono from 'ono'

const DAYS_AGO_FOR_DELETION = 30

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
  // remove org assets
  await deleteOrgDirectory(orgId)
  // remove fields
  await BusinessField.deleteAllForOrg(orgId, true)
  // remove documentVersions
  await BusinessDocumentVersion.deleteAllForOrg(orgId, true)
  // remove documents
  await BusinessDocument.deleteAllForOrg(orgId, true)
  // remove project tokens
  await BusinessProjectToken.deleteAllForOrg(orgId, true)
  // Remove project webhooks and webhook deliveries
  await BusinessWebhook.deleteAllForOrg(orgId, true)
  // remove project users
  await BusinessProjectUser.deleteAllForOrg(orgId, true)
  // remove projects
  await BusinessProject.deleteAllForOrg(orgId, true)
  // remove users
  await BusinessUser.deleteAllForOrg(orgId, true)
  // remove org resource usage
  await BusinessResourceUsage.deleteAllForOrg(orgId, true)
  // remove org
  await BusinessOrganization.deleteById(orgId, true)
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

  await organizationCoordinator.removeAllOrgData(orgId)
}

// Permanently deletes an org and associated resources
const deleteOrg = async function (orgId) {
  const org = await BusinessOrganization.findById(orgId)
  await stripeIntegrator.deleteCustomer(org.stripeId)
  await organizationCoordinator.removeAllOrgData(orgId)
}

const organizationCoordinator = {
  updateById,
  removeAllOrgData,
  deleteCanceledOrg,
  deleteOrg
}

export default organizationCoordinator