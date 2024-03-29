import ono from 'ono'
import { Op } from 'sequelize'

import { getDb } from '../db/dbConnector'
import resourceTypes from '../constants/resourceTypes'
import resourcePublicFields from '../constants/resourcePublicFields'
import { pick } from '../libs/utils'
import { getSortOptions } from '../libs/queryFilters'

export const MODEL_NAME = 'Webhook'

const PUBLIC_FIELDS = resourcePublicFields[resourceTypes.WEBHOOK]

const publicFields = (instance) => {
  return pick(instance, PUBLIC_FIELDS)
}

async function create(body) {
  const db = getDb()
  const webhook = await db.model(MODEL_NAME).create(body)
  return publicFields(webhook)
}

async function findById(id, orgId) {
  const db = getDb()
  const sortOptions = getSortOptions()

  return await db.model(MODEL_NAME).findOne({
    attributes: PUBLIC_FIELDS,
    where: { id, orgId },
    ...sortOptions,
    raw: true
  })
}

async function updateById(id, body, orgId) {
  const db = getDb()
  const webhook = await db.model(MODEL_NAME).findOne({ where: { id, orgId } })

  if (!webhook) throw ono({ code: 404 }, `Cannot update, webhook not found with id: ${id}`)

  const updatedWebhook = await webhook.update(body)
  return publicFields(updatedWebhook)
}

async function findAllByProjectId(projectId, orgId) {
  const db = getDb()
  // TODO: validate project id?
  const webhooks = await db.model(MODEL_NAME).findAll({ where: { projectId, orgId }})
  return webhooks.map(publicFields)
}

async function deleteById(id, orgId) {
  const db = getDb()
  const webhook = await db.model(MODEL_NAME).findOne({ where: { id, orgId } })

  if (!webhook) throw ono({ code: 404 }, `Cannot delete, webhook not found with id: ${id}`)

  await webhook.destroy()
}

async function deleteAllForOrg(orgId, force = false) {
  const db = getDb()

  return db.model(MODEL_NAME).destroy({
    where: { orgId },
    force
  })
}

// Hard deletion, not org-specific!
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

async function deleteAllForProject(projectId, orgId) {
  const db = getDb()

  return db.model(MODEL_NAME).destroy({
    where: { projectId, orgId }
  })
}

export default {
  create,
  findById,
  findAllByProjectId,
  updateById,
  deleteById,
  deleteAllForOrg,
  deleteAllSoftDeletedBefore,
  deleteAllForProject
}