import { getDb } from '../db/dbConnector'
import ono from 'ono'
import resourcePublicFields from '../constants/resourcePublicFields'
import resourceTypes from '../constants/resourceTypes'

const MODEL_NAME = 'Organization'
const PUBLIC_FIELDS = resourcePublicFields[resourceTypes.ORGANIZATION]

async function create(body) {
  const db = getDb()
  const createdProject = await db.model(MODEL_NAME).create(body)
  const plainOrg = createdProject.get({ plain: true })
  return Object.assign({}, ...PUBLIC_FIELDS.map(key => ({ [key]: plainOrg[key] })))
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
  const plainOrg = updatedOrganization.get({ plain: true })
  return Object.assign({}, ...PUBLIC_FIELDS.map(key => ({ [key]: plainOrg[key] })))
}

export default {
  create,
  findSanitizedById,
  updateById
}
