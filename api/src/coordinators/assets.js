import { URL } from 'url'
import { uploadContent, deleteContent, getContentMetadata } from '../integrators/s3'
import BusinessResourceUsage, { RESOURCE_TYPES } from '../businesstime/resourceusage'
import BusinessOrganization from '../businesstime/organization'
import { PLAN_ASSET_STORAGE_BYTES } from '../constants/plans'

async function addAssetForDocument(documentId, orgId, file) {
  await assetsCoordinator.recordOrgAsset(orgId, file.size)
  return await uploadContent(documentId, orgId, file)
}

async function recordOrgAsset(orgId, size) {
  const org = await BusinessOrganization.findSanitizedById(orgId)
  const maxBytes = PLAN_ASSET_STORAGE_BYTES[org.plan]
  await BusinessResourceUsage.updateUsageByType(orgId, RESOURCE_TYPES.ASSET, size, maxBytes)
}

async function deleteAsset(assetUrlString, orgId) {
  const assetUrl = new URL(assetUrlString)
  // remove beginning "/" from pathname
  const s3AssetKey = decodeURIComponent(assetUrl.pathname.slice(1))
  const fileSize = (await getContentMetadata(s3AssetKey)).size
  await deleteContent(s3AssetKey)
  await assetsCoordinator.recordOrgAsset(orgId, fileSize * -1)
}

const assetsCoordinator = {
  addAssetForDocument,
  recordOrgAsset,
  deleteAsset
}

export default assetsCoordinator