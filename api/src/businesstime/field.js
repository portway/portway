import ono from 'ono'

import { getDb } from '../db/dbConnector'

const MODEL_NAME = 'Field'

async function createForProjectDocument(projectId, docId, body) {
  const db = getDb()
  const { orgId } = body

  if (projectId !== body.projectId) {
    throw ono(
      { code: 400 },
      `Cannot create field, project id param does not match projectId in body`
    )
  }

  if (docId !== body.docId) {
    throw ono({ code: 400 }, `Cannot create field, document id param does not match docId in body`)
  }

  const document = await db
    .model('Document')
    .findOne({ where: { id: docId, projectId, orgId }, raw: true })

  if (!document) {
    throw ono({ code: 404 }, `Cannot create field, document not found with id: ${docId}`)
  }

  const createdDocument = await db.model(MODEL_NAME).create(body)
  return createdDocument.get({ plain: true })
}

async function findAllForProjectDocument(projectId, docId, orgId) {
  const db = getDb()
  return await db.model(MODEL_NAME).findAll({ where: { projectId, docId, orgId }, raw: true })
}

async function findByIdForProjectDocument(id, projectId, docId, orgId) {
  const db = getDb()
  return await db.model(MODEL_NAME).findOne({ where: { id, projectId, docId, orgId }, raw: true })
}

async function updateByIdForProjectDocument(id, projectId, docId, orgId, body) {
  const db = getDb()

  if (projectId !== body.projectId) {
    throw ono({ code: 400 }, `Cannot update, project id param does not match projectId in body`)
  }

  const field = await db.model(MODEL_NAME).findOne({ where: { id, projectId, docId, orgId } })

  if (!field) throw ono({ code: 404 }, `Cannot update, field not found with id: ${id}`)

  const updatedDocument = await field.update(body)
  return updatedDocument.get({ plain: true })
}

async function deleteByIdForProjectDocument(id, projectId, docId, orgId) {
  const db = getDb()
  const field = await db.model(MODEL_NAME).findOne({ where: { id, projectId, docId, orgId } })

  if (!field) throw ono({ code: 404 }, `Cannot delete, field not found with id: ${id}`)

  await field.destroy()
}

export default {
  createForProjectDocument,
  updateByIdForProjectDocument,
  findByIdForProjectDocument,
  findAllForProjectDocument,
  deleteByIdForProjectDocument
}
