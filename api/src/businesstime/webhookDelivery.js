import ono from 'ono'
import { Op } from 'sequelize'

import { getDb } from '../db/dbConnector'
import resourceTypes from '../constants/resourceTypes'
import resourcePublicFields from '../constants/resourcePublicFields'
import { pick } from '../libs/utils'
import { getPaginationOptions, getSortOptions } from '../libs/queryFilters'
import { SORT_METHODS } from '../constants/queryOptions'

export const MODEL_NAME = 'WebhookDelivery'

const PUBLIC_FIELDS = resourcePublicFields[resourceTypes.WEBHOOK_DELIVERY]

const publicFields = (instance) => {
  return pick(instance, PUBLIC_FIELDS)
}

async function create(body) {
  const db = getDb()
  const webhookDelivery = await db.model(MODEL_NAME).create(body)
  return publicFields(webhookDelivery)
}

async function findAllByWebhookId(webhookId, options, orgId) {
  const db = getDb()
  const paginationOptions = getPaginationOptions(options.page, options.perPage)
  const sortOptions = getSortOptions('createdAt', SORT_METHODS.DESCENDING)

  const result = await db.model(MODEL_NAME).findAndCountAll({
    where: { webhookId, orgId },
    ...paginationOptions,
    ...sortOptions
  })

  return { webhookDeliveries: result.rows.map(publicFields), count: result.count }
}

async function findAllOlderThanThirtyDays(options) {
  const db = getDb()
  const paginationOptions = getPaginationOptions(options.page, options.perPage)
  const sortOptions = getSortOptions()
  // jesus javascript
  const date = new Date(new Date().setDate(new Date().getDate() - 30))

  const result = await db.model(MODEL_NAME).findAndCountAll({
    where: {
      createdAt: {
        [Op.lte]: date
      }
    },
    ...paginationOptions,
    ...sortOptions
  })

  return {
    webhookDeliveries: result.rows.map(publicFields),
    count: result.count
  }
}

// Do not invoke from user-facing endpoints as org id is not required!
async function deleteById(id) {
  const db = getDb()
  const webhookDelivery = await db.model(MODEL_NAME).findOne({ where: { id } })

  if (!webhookDelivery) throw ono({ code: 404 }, `Cannot delete, webhookDelivery delivery not found with id: ${id}`)

  await webhookDelivery.destroy()
}

// TODO: need to test if this is needed: probably just delete the webhook and the cascade
// constraint will delete all these
async function deleteByWebhookId(webhookId, orgId) {
  const db = getDb()

  return db.model(MODEL_NAME).destroy({
    where: { webhookId, orgId }
  })
}

async function deleteAllForOrg(orgId, force = false) {
  const db = getDb()

  return db.model(MODEL_NAME).destroy({
    where: { orgId },
    force
  })
}

export default {
  create,
  findAllByWebhookId,
  findAllOlderThanThirtyDays,
  deleteById,
  deleteByWebhookId,
  deleteAllForOrg
}