import { getDb } from '../db/dbConnector'
import ono from 'ono'
import resourceTypes from '../constants/resourceTypes'
import resourcePublicFields from '../constants/resourcePublicFields'
import { pick } from '../libs/utils'

const MODEL_NAME = 'ProjectToken'

const PUBLIC_FIELDS = resourcePublicFields[resourceTypes.PROJECT_TOKEN]

const publicFields = (instance) => {
  return pick(instance, PUBLIC_FIELDS)
}

async function create(body) {
  const db = getDb()
  const createdToken = await db.model(MODEL_NAME).create(body)
  return publicFields(createdToken)
}

async function findById(id, orgId) {
  const db = getDb()
  return await db.model(MODEL_NAME).findOne({
    attributes: PUBLIC_FIELDS,
    where: { orgId, id },
    raw: true
  })
}

// To be used only internally!
async function findByIdUnsanitized(id, orgId) {
  const db = getDb()
  return await db.model(MODEL_NAME).findOne({
    where: { orgId, id },
    raw: true
  })
}

async function findAllByProjectId(projectId, orgId) {
  const db = getDb()
  const tokens = await db.model(MODEL_NAME).findAll({
    attributes: PUBLIC_FIELDS,
    where: { projectId, orgId }
  })
  return tokens.map(publicFields)
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

async function addTokenStringById(id, tokenString, orgId) {
  const db = getDb()
  const token = await db.model(MODEL_NAME).findOne({
    where: { orgId, id }
  })
  const updatedToken = await token.update({
    token: tokenString
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

async function deleteAllForOrg(orgId) {
  const db = getDb()

  return db.model(MODEL_NAME).destroy({
    where: { orgId }
  })
}

export default {
  create,
  findById,
  findByIdUnsanitized,
  findAllByProjectId,
  updateNameById,
  addTokenStringById,
  deleteById,
  deleteAllForOrg
}
