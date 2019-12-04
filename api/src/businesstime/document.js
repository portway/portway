import { getDb } from '../db/dbConnector'
import ono from 'ono'
import { pick } from '../libs/utils'
import resourceTypes from '../constants/resourceTypes'
import resourcePublicFields from '../constants/resourcePublicFields'
import { getFieldValueInclude } from './field'
import { Op } from 'sequelize'

const MODEL_NAME = 'Document'

const PROJECT_DOCUMENT_PUBLIC_FIELDS = resourcePublicFields[resourceTypes.PROJECT_DOCUMENT]

const publicFields = (instance) => {
  return pick(instance, PROJECT_DOCUMENT_PUBLIC_FIELDS)
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

async function findAllForProject(projectId, options = {}, orgId) {
  const db = getDb()
  let where = { projectId, orgId }

  if (options.search) {
    where = {
      [db.Op.and]: [
        {
          ...where
        },
        {
          name: {
            [db.Op.iLike]: `%${options.search}%`
          }
        }
      ]
    }
  }

  return await db.model(MODEL_NAME).findAll({
    attributes: PROJECT_DOCUMENT_PUBLIC_FIELDS,
    where: where,
    raw: true
  })
}

async function findAllPublishedForProject(projectId, options = {}, orgId) {
  const db = getDb()
  const where = { projectId, orgId, publishedVersionId: { [Op.ne]: null } }

  return await db.model(MODEL_NAME).findAll({
    attributes: PROJECT_DOCUMENT_PUBLIC_FIELDS,
    where,
    raw: true
  })
}

async function findByIdForProject(id, projectId, orgId) {
  const db = getDb()
  return await db.model(MODEL_NAME).findOne({
    where: { id, projectId, orgId },
    raw: true,
    attributes: PROJECT_DOCUMENT_PUBLIC_FIELDS
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

async function findById(id, orgId) {
  const db = getDb()
  const document = await db.model(MODEL_NAME).findOne({
    where: { id, orgId },
    attributes: PROJECT_DOCUMENT_PUBLIC_FIELDS,
    raw: true
  })

  if (!document) {
    throw ono({ code: 404 }, `Document id ${id} not found`)
  }

  return document
}

async function findByIdWithPublishedFields(id, orgId) {
  const db = getDb()
  const document = await db.model(MODEL_NAME).findOne({
    where: {
      id,
      orgId
    },
    include: [{
      model: db.model('Field'),
      where: {
        versionId: { [Op.col]: `${MODEL_NAME}.publishedVersionId` }
      },
      required: false,
      include: getFieldValueInclude(db)
    }],
    order: [
      [db.model('Field'), 'order', 'ASC']
    ]
  })

  return publicDocumentWithFields(document)
}

async function findByIdWithFields(id, orgId) {
  const db = getDb()
  const document = await db.model(MODEL_NAME).findOne({
    where: { id, orgId },
    include: [{
      model: db.model('Field'),
      where: { versionId: null },
      required: false,
      include: getFieldValueInclude(db)
    }],
    order: [
      [db.model('Field'), 'order', 'ASC']
    ],
  })

  return publicDocumentWithFields(document)
}

async function publicDocumentWithFields(document) {
  if (!document) return document

  const fields = document.Fields.map((field) => {
    return pick(field, resourcePublicFields[resourceTypes.FIELD])
  })

  return pick({ ...document.get({ plain: true }), fields }, resourcePublicFields[resourceTypes.DOCUMENT])
}

export default {
  createForProject,
  updateByIdForProject,
  findByIdForProject,
  findAllForProject,
  findAllPublishedForProject,
  deleteByIdForProject,
  findParentProjectByDocumentId,
  findByIdWithPublishedFields,
  findByIdWithFields,
  findById
}
