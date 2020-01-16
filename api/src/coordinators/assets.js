import { uploadContent } from '../integrators/s3'
import BusinessResourceUsage, { RESOURCE_TYPES } from '../businesstime/resourceUsage'
import BusinessOrganization from '../businesstime/organization'
import { PLAN_ASSET_STORAGE_BYTES } from '../constants/plans'

async function addAssetForDocument(documentId, orgId, file) {
  await assetsCoordinator.recordOrgAsset(orgId, file)
  return await uploadContent(documentId, orgId, file)
}

async function recordOrgAsset(orgId, file) {
  const org = await BusinessOrganization.findSanitizedById(orgId)
  const maxBytes = PLAN_ASSET_STORAGE_BYTES[org.plan]
  await BusinessResourceUsage.addUsageByType(orgId, RESOURCE_TYPES.ASSET, file.size, maxBytes)
}

const assetsCoordinator = {
  addAssetForDocument,
  recordOrgAsset
}

export default assetsCoordinator