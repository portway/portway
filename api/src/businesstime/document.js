import { getDb } from '../db/dbConnector'
import ono from 'ono'
import { pick } from '../libs/utils'
import resourceTypes from '../constants/resourceTypes'
import resourcePublicFields from '../constants/resourcePublicFields'

const MODEL_NAME = 'Document'

const PUBLIC_FIELDS = resourcePublicFields[resourceTypes.DOCUMENT]

const publicFields = (instance) => {
  return pick(instance, PUBLIC_FIELDS)
}

async function createForProject(projectId, body) {
  const db = getDb()
  const { orgId } = body

  const project = await db.model('Project').findOne({ where: { id: projectId, orgId } })

  if (!project) {
    throw ono({ code: 404 }, `Cannot create document, project not found with id: ${projectId}`)
  }

  const createdDocument = await db.model(MODEL_NAME).create({ ...body, projectId })
  return publicFields(createdDocument)
}

async function findAllForProject(projectId, orgId) {
  const db = getDb()
  return await db.model(MODEL_NAME).findAll({
    attributes: PUBLIC_FIELDS,
    where: { projectId, orgId },
    raw: true
  })
}

async function findById(id, orgId) {
  const db = getDb()
  return await db.model(MODEL_NAME).findOne({
    where: { id, orgId },
    raw: true,
    attributes: PUBLIC_FIELDS
  })
}

async function findByIdForProject(id, projectId, orgId) {
  const db = getDb()
  return await db.model(MODEL_NAME).findOne({
    where: { id, projectId, orgId },
    raw: true,
    attributes: PUBLIC_FIELDS
  })
}

async function updateByIdForProject(id, projectId, orgId, body) {
  const db = getDb()

  const document = await db.model(MODEL_NAME).findOne({ where: { id, projectId, orgId } })

  if (!document) throw ono({ code: 404 }, `Cannot update, document not found with id: ${id}`)

  const updatedDocument = await document.update(body)
  return publicFields(updatedDocument)
}

async function deleteByIdForProject(id, projectId, orgId) {
  const db = getDb()
  const document = await db.model(MODEL_NAME).findOne({ where: { id, projectId, orgId } })

  if (!document) throw ono({ code: 404 }, `Cannot delete, document not found with id: ${id}`)

  await document.destroy()
}

async function findParentProjectByDocumentId(id, orgId) {
  const db = getDb()

  const document = await db
    .model(MODEL_NAME)
    .findOne({ where: { id, orgId }, include: [{ model: db.model('Project') }] })

  const project = document.Project && document.Project.get({ plain: true })

  return pick(project, resourcePublicFields[resourceTypes.PROJECT])
}

export default {
  createForProject,
  updateByIdForProject,
  findById,
  findByIdForProject,
  findAllForProject,
  deleteByIdForProject,
  findParentProjectByDocumentId
}
