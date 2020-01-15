import { getDb } from '../db/dbConnector'

export const MODEL_NAME = 'OrganizationResourceUsage'

export const RESOURCE_TYPES = {
  ASSET: 1
}

async function addUsageByType(orgId, type, value) {
  const usage = await findOrCreateUsageByType(orgId, type)
}

async function findOrCreateUsageByType(orgId, resourceType) {
  const db = getDb()
  const usage = await db.model(MODEL_NAME).findOne({ where: { orgId, resourceType } })

  return usage
}

export default {
  addUsageByType,
  findOrCreateUsageByType
}
