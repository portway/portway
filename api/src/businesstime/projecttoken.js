import { getDb } from '../db/dbConnector'
import ono from 'ono'

const MODEL_NAME = 'ApiKey'

const PUBLIC_FIELDS = ['name', 'projectId', 'roleId']

const publicFields = (instance) => {
  return PUBLIC_FIELDS.reduce((obj, field) => {
    obj[field] = instance[field]
    return obj
  }, {})
}

async function create(body) {
  const db = getDb()
  const createdToken = await db.model(MODEL_NAME).create(body)
  return publicFields(createdToken)
}

async function findAllByProjectId(projectId, orgId) {
  const db = getDb()
  const tokens = await db.model(MODEL_NAME).findAll({
    attributes: PUBLIC_FIELDS,
    where: { projectId, orgId }
  })
  return tokens
}

async function updateNameById(id, updatedName, orgId) {
  const db = getDb()
  const token = await db.model(MODEL_NAME).findOne({ where: { id, orgId } })

  if (!token) throw ono({ code: 404 }, `Cannot update, token not found with id: ${id}`)

  const updatedToken = await token.update({
    name: updatedName
  })
  return publicFields(updatedToken)
}

async function deleteById(id, orgId) {
  const db = getDb()
  const token = await db.model(MODEL_NAME).findOne({ where: { id, orgId } })

  if (!token) {
    throw ono(
      { code: 404 },
      `Cannot delete, token not found with id ${id}`
    )
  }

  await token.destroy()
}

export default {
  create,
  findAllByProjectId,
  updateNameById,
  deleteById
}
