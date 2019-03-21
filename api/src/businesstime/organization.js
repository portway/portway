import { getDb } from '../db/dbConnector'
import ono from 'ono'
import GLOBAL_PUBLIC_FIELDS from '../constants/globalPublicFields'

const MODEL_NAME = 'Organization'
const PUBLIC_FIELDS = [...GLOBAL_PUBLIC_FIELDS, 'name']

async function create(body) {
  const db = getDb()
  const createdProject = await db.model(MODEL_NAME).create(body)
  return createdProject.get({ plain: true })
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
