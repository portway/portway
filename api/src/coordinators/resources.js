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

export async function deleteSoftDeletedResources() {
  const thirtyDaysAgo = new Date(new Date().setDate(new Date().getDate() - 30))
  // remove fields
  await BusinessField.deleteAllSoftDeletedBefore(thirtyDaysAgo)
  // remove documentVersions
  await BusinessDocumentVersion.deleteAllSoftDeletedBefore(thirtyDaysAgo)
  // remove documents
  await BusinessDocument.deleteAllSoftDeletedBefore(thirtyDaysAgo)
  // remove project tokens
  await BusinessProjectToken.deleteAllSoftDeletedBefore(thirtyDaysAgo)
  // Remove project webhooks and webhook deliveries
  await BusinessWebhook.deleteAllSoftDeletedBefore(thirtyDaysAgo)
  // remove project users
  await BusinessProjectUser.deleteAllSoftDeletedBefore(thirtyDaysAgo)
  // remove projects
  await BusinessProject.deleteAllSoftDeletedBefore(thirtyDaysAgo)
  // remove users
  await BusinessUser.deleteAllSoftDeletedBefore(thirtyDaysAgo)
  // remove org resource usage
  await BusinessResourceUsage.deleteAllSoftDeletedBefore(thirtyDaysAgo)
  // remove org
  await BusinessOrganization.deleteAllSoftDeletedBefore(thirtyDaysAgo)
}