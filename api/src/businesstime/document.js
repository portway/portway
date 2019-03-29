import { getDb } from '../db/dbConnector'
import ono from 'ono'

const MODEL_NAME = 'Document'

async function createForProject(projectId, body) {
  const db = getDb()
  const { orgId } = body

  if (projectId !== body.projectId) {
    throw ono({ code: 400 }, `Cannot create, project id param does not match projectId in body`)
  }

  const project = await db.model('Project').findOne({ where: { id: projectId, orgId } })

  if (!project) {
    throw ono({ code: 404 }, `Cannot create document, project not found with id: ${projectId}`)
  }

  const createdDocument = await db.model(MODEL_NAME).create(body)
  return createdDocument.get({ plain: true })
}

async function findAllForProject(projectId, orgId) {
  const db = getDb()
  return await db.model(MODEL_NAME).findAll({ where: { projectId, orgId }, raw: true })
}

async function findByIdForProject(id, projectId, orgId) {
  const db = getDb()
  return await db.model(MODEL_NAME).findOne({ where: { id, projectId, orgId }, raw: true })
}

async function updateByIdForProject(id, projectId, orgId, body) {
  const db = getDb()

  if (projectId !== body.projectId) {
    throw ono({ code: 400 }, `Cannot update, project id param does not match projectId in body`)
  }

  const document = await db.model(MODEL_NAME).findOne({ where: { id, projectId, orgId } })

  if (!document) throw ono({ code: 404 }, `Cannot update, document not found with id: ${id}`)

  const updatedDocument = await document.update(body)
  return updatedDocument.get({ plain: true })
}

async function deleteByIdForProject(id, projectId, orgId) {
  const db = getDb()
  const document = await db.model(MODEL_NAME).findOne({ where: { id, projectId, orgId } })

  if (!document) throw ono({ code: 404 }, `Cannot delete, document not found with id: ${id}`)

  await document.destroy()
}

export default {
  createForProject,
  updateByIdForProject,
  findByIdForProject,
  findAllForProject,
  deleteByIdForProject
}
