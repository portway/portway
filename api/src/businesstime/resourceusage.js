import ono from 'ono'
import { Op } from 'sequelize'

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

async function deleteAllForOrg(orgId, force = false) {
  const db = getDb()

  return db.model(MODEL_NAME).destroy({
    where: { orgId },
    force
  })
}

async function deleteAllSoftDeletedBefore(timestamp) {
  const db = getDb()

  return db.model(MODEL_NAME).destroy({
    where: {
      deletedAt: {
        [Op.lte]: timestamp
      }
    },
    force: true
  })
}

async function findOrgAssetUsageValue(orgId) {
  const db = getDb()
  const usage = await db.model(MODEL_NAME).find({ where: { orgId, resourceType: RESOURCE_TYPES.ASSET }})

  return usage ? usage.value : 0
}

export default {
  updateUsageByType,
  findOrCreateUsageByType,
  deleteAllForOrg,
  deleteAllSoftDeletedBefore,
  findOrgAssetUsageValue
}
