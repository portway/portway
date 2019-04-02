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

  const createdField = await db.model(MODEL_NAME).create(body)
  return createdField.get({ plain: true })
}

async function findAllForDocument(docId, orgId) {
  const db = getDb()
  console.log(db.models.FieldTypeStringValue)
  return await db
    .model(MODEL_NAME)
    .findAll({ where: { docId, orgId }, include: [{ model: db.model('FieldTypeStringValue') }] })
}

async function findByIdForDocument(id, docId, orgId) {
  const db = getDb()
  return await db.model(MODEL_NAME).findOne({ where: { id, docId, orgId }, raw: true })
}

async function updateByIdForProjectDocument(id, projectId, docId, orgId, body) {
  const db = getDb()

  const document = await db
    .model('Document')
    .findOne({ where: { id: docId, projectId, orgId }, raw: true })

  if (!document) {
    throw ono({ code: 404 }, `Cannot update field, document not found with id: ${docId}`)
  }

  const field = await db.model(MODEL_NAME).findOne({ where: { id, docId, orgId } })

  if (!field) throw ono({ code: 404 }, `Cannot update, field not found with id: ${id}`)
  const updatedField = await field.update(body)
  return updatedField.get({ plain: true })
}

async function deleteByIdForDocument(id, docId, orgId) {
  const db = getDb()
  const field = await db.model(MODEL_NAME).findOne({ where: { id, docId, orgId } })

  if (!field) throw ono({ code: 404 }, `Cannot delete, field not found with id: ${id}`)

  await field.destroy()
}

export default {
  createForProjectDocument,
  updateByIdForProjectDocument,
  findByIdForDocument,
  findAllForDocument,
  deleteByIdForDocument
}
