import ono from 'ono'

import { getDb } from '../db/dbConnector'
import resourcePublicFields from '../constants/resourcePublicFields'
import resourceTypes from '../constants/resourceTypes'
import { pick } from '../libs/utils'
import { Op } from 'sequelize'

const MODEL_NAME = 'Organization'
const PUBLIC_FIELDS = resourcePublicFields[resourceTypes.ORGANIZATION]

const publicFields = (instance) => {
  return pick(instance, PUBLIC_FIELDS)
}

async function create(body) {
  const db = getDb()
  const createdOrg = await db.model(MODEL_NAME).create(body)
  return publicFields(createdOrg)
}


async function findAll() {
  const db = getDb()
  return await db.model(MODEL_NAME).findAll({ attributes: PUBLIC_FIELDS, raw: true })
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

  if (!organization) {
    throw ono({ code: 404 }, `Cannot find organization with id: ${orgId}`)
  }

  return organization.get({ plain: true })
}

async function findByStripeId(stripeId) {
  //TODO we might want to index by stripeId as well if this is getting used enough
  const db = getDb()
  const organization = await db.model(MODEL_NAME).findOne({ where: { stripeId } })

  if (!organization) {
    throw ono({ code: 404 }, `No organization found with stripeId: ${stripeId}`)
  }

  return organization.get({ plain: true })
}

async function deleteById(id, force = false) {
  const db = getDb()
  return db.model(MODEL_NAME).destroy({
    where: { id },
    force
  })
}

async function findAllCanceled() {
  const db = getDb()
  const orgs = await db.model(MODEL_NAME).findAll({
    attributes: PUBLIC_FIELDS,
    where: {
      canceledAt: { [Op.ne]: null }
    },
    raw: true
  })

  return orgs
}

export default {
  create,
  findSanitizedById,
  updateById,
  findAll,
  findById,
  findByStripeId,
  deleteById,
  findAllCanceled
}
