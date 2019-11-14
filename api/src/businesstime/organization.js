import ono from 'ono'

import { getDb } from '../db/dbConnector'
import resourcePublicFields from '../constants/resourcePublicFields'
import resourceTypes from '../constants/resourceTypes'
import { pick } from '../libs/utils'


const MODEL_NAME = 'Organization'
const PUBLIC_FIELDS = resourcePublicFields[resourceTypes.ORGANIZATION]

const publicFields = (instance) => {
  return pick(instance, PUBLIC_FIELDS)
}

async function create(body) {
  const db = getDb()
  const createdProject = await db.model(MODEL_NAME).create(body)
  return publicFields(createdProject)
}

async function findSanitizedById(id) {
  const db = getDb()

  return await db.model(MODEL_NAME).findByPk(id, { attributes: PUBLIC_FIELDS, raw: true })
}

async function updateById(id, body) {
  const db = getDb()
  const organization = await db.model(MODEL_NAME).findByPk(id)

  if (!organization) {
    throw ono({ code: 404 }, `Cannot update, organization not found with id: ${id}`)
  }

  const updatedOrganization = await organization.update(body)
  return publicFields(updatedOrganization)
}

async function findById(orgId) {
  const db = getDb()
  const organization = await db.model(MODEL_NAME).findByPk(orgId)

  return organization.get({ plain: true })
}

async function updateByStripeId(stripeId, body) {
  //TODO we might want to index by stripeId as well if this is getting used enough
  const db = getDb()
  const organization = await db.model(MODEL_NAME).findOne({ where: { stripeId } })

  if (!organization) {
    throw ono({ code: 404 }, `Cannot update, organization not found with stripe id: ${stripeId}`)
  }

  const updatedOrganization = await organization.update(body)
  return publicFields(updatedOrganization)
}

export default {
  create,
  findSanitizedById,
  updateById,
  findById,
  updateByStripeId
}
