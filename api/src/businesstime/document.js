import { getDb } from '../db/dbConnector'
import ono from 'ono'

const MODEL_NAME = 'Document'

async function create(body) {
  const db = getDb()
  const createdDocument = await db.model(MODEL_NAME).create(body)
  return createdDocument.get({ plain: true })
}

async function findAll(projectId, orgId) {
  const db = getDb()
  return await db.model(MODEL_NAME).findAll({ where: { id: projectId, orgId }, raw: true })
}

async function findById(id, orgId) {
  const db = getDb()
  return await db.model(MODEL_NAME).findOne({ where: { id, orgId }, raw: true })
}

async function updateById(id, orgId, body) {
  const db = getDb()
  const document = await db.model(MODEL_NAME).findOne({ where: { id, orgId } })

  if (!document) throw ono({ code: 404 }, `Cannot update, document not found with id: ${id}`)

  const updatedDocument = await document.update(body)
  return updatedDocument.get({ plain: true })
}

async function deleteById(id, orgId) {
  const db = getDb()
  const document = await db.model(MODEL_NAME).findOne({ where: { id, orgId } })

  if (!document) throw ono({ code: 404 }, `Cannot update, document not found with id: ${id}`)

  await document.destroy()
}

export default {
  create,
  findById,
  findAll,
  updateById,
  deleteById
}
