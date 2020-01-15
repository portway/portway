import { uploadContent } from '../integrators/s3'
import BusinessResourceUsage, { RESOURCE_TYPES } from '../businesstime/resourceUsage'

async function addAssetForDocument(documentId, orgId, file) {
  return await uploadContent(documentId, orgId, file)
}

async function recordOrgAsset(orgId, file, assetType) {

}

export default {
  addAssetForDocument,
  recordOrgAsset
}