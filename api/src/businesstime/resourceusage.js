import ono from 'ono'
import { getDb } from '../db/dbConnector'

export const MODEL_NAME = 'OrganizationResourceUsage'

export const RESOURCE_TYPES = {
  ASSET: 1
}

async function updateUsageByType(orgId, type, value, maxValue) {
  if (!Number.isInteger(value)) {
    throw ono({ code: 400 }, `value must be an integer, received ${value}`)
  }
  if (!Number.isInteger(maxValue)) {
    throw ono({ code: 400 }, `maxValue must be an integer, received ${maxValue}`)
  }
  const usage = await findOrCreateUsageByType(orgId, type)
  const currentValue = usage.get('value')
  const newValue = currentValue + value
  if (newValue > maxValue) {
    throw ono(
      {
        code: 400,
        publicMessage: 'You have reached your storage limit for assets'
      },
      `Asset storage has exceeded maximum allowed value of ${maxValue}`)
  }
  await usage.update({ value: newValue })
}

async function findOrCreateUsageByType(orgId, resourceType) {
  const db = getDb()
  // findOrCreate returns [instance, created]
  const usage = (await db.model(MODEL_NAME).findOrCreate({ where: { orgId, resourceType } }))[0]
  return usage
}

export default {
  updateUsageByType,
  findOrCreateUsageByType
}
