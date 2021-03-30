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

  // set updatedAt on the parent project, no need to wait for it
  project.markUpdated()

  return publicFields(createdDocument)
}

async function findAllForProject(projectId, orgId, options = {}) {
  const db = getDb()
  const query = {
    attributes: PROJECT_DOCUMENT_PUBLIC_FIELDS,
    raw: true,
    where: { projectId, orgId }
  }

  if (options.search) {
    query.raw = false
    query.where = {
      [db.Op.and]: [
        {
          ...query.where
        },
        {
          [db.Op.or]: [
            { name: { [db.Op.iLike]: `%${options.search}%` } },
            { '$Fields.FieldTypeTextValue.value$': { [db.Op.iLike]: `%${options.search}%` } }
          ]
        }
      ]
    }
    query.include = [{
      model: db.model('Field'),
      required: false,
      include: getFieldValueInclude(db)
    }]
  }

  const documents = await db.model(MODEL_NAME).findAll(query)
  return documents.map(publicFields)
}

async function findAllPublishedForProject(projectId, orgId) {
  const db = getDb()
  const documents = await db.model(MODEL_NAME).findAll({
    where: { projectId, orgId, publishedVersionId: { [Op.ne]: null } },
    include: [
      {
        model: db.model('DocumentVersion'),
        where: {
          id: { [Op.col]: `${MODEL_NAME}.publishedVersionId` }
        },
        required: true
      }
    ]
  })

  return documents.map((document) => {
    // get the published doc name from the value stored on the currently published DocumentVersion
    const docVersion = document.DocumentVersions[0]
    return { ...publicFields(document), name: docVersion.name }
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

async function findPublishedByIdForProject(id, projectId, orgId) {
  const db = getDb()
  const document = await db.model(MODEL_NAME).findOne({
    where: { id, projectId, orgId, publishedVersionId: { [Op.ne]: null } },
    include: [
      {
        model: db.model('DocumentVersion'),
        where: {
          id: { [Op.col]: `${MODEL_NAME}.publishedVersionId` }
        },
        required: true
      }
    ]
  })

  if (!document) return document
  // get the published doc name from the value stored on the currently published DocumentVersion
  const docVersion = document.DocumentVersions[0]
  return { ...publicFields(document), name: docVersion.name }
}

async function updateByIdForProject(id, projectId, orgId, body) {
  const db = getDb()

  const document = await db.model(MODEL_NAME).findOne({ where: { id, projectId, orgId } })

  if (!document) throw ono({ code: 404 }, `Cannot update, document not found with id: ${id}`)

  const updatedDocument = await document.update(body)

  // set updatedAt on the parent project, no need to wait for it
  db.model('Project').findOne({ where: { id: document.projectId, orgId } }).then((project) => { project.markUpdated() })

  return publicFields(updatedDocument)
}

/**
 * 
 * @param {Integer} id 
 * @param {Integer} projectId 
 * @param {Integer} orgId 
 * @param {Object} options 
 * 
 * options = {
 *   markUpdated: true/false // whether to mark the parent project as updated
 * }
 */
async function deleteByIdForProject(id, projectId, orgId, options = { markUpdated: true }) {
  const db = getDb()
  const document = await db.model(MODEL_NAME).findOne({ where: { id, projectId, orgId } })

  if (!document) throw ono({ code: 404 }, `Cannot delete, document not found with id: ${id}`)

  await document.destroy()

  if (options.markUpdated) {
    // set updatedAt on the parent project, no need to wait for it
    db.model('Project').findOne({ where: { id: document.projectId, orgId } }).then((project) => {
      if (project && typeof project.markUpdated === 'function') {
        project.markUpdated()
      }
    })
  }
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
      orgId,
      publishedVersionId: { [Op.ne]: null }
    },
    include: [
      {
        model: db.model('Field'),
        where: {
          versionId: { [Op.col]: `${MODEL_NAME}.publishedVersionId` }
        },
        required: false,
        include: getFieldValueInclude(db)
      },
      {
        model: db.model('DocumentVersion'),
        where: {
          id: { [Op.col]: `${MODEL_NAME}.publishedVersionId` }
        },
        required: true
      }
    ],
    order: [[db.model('Field'), 'order', 'ASC']]
  })

  if (!document) return document

  const documentVersion = document.DocumentVersions[0]
  // attach the published doc name
  return { ...publicDocumentWithFields(document), name: documentVersion.name }
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

function publicDocumentWithFields(document) {
  if (!document) return document

  const fields = document.Fields.map((field) => {
    return pick(field, resourcePublicFields[resourceTypes.FIELD])
  })

  return pick({ ...document.get({ plain: true }), fields }, resourcePublicFields[resourceTypes.DOCUMENT])
}

async function deleteAllForOrg(orgId, force = false) {
  const db = getDb()

  return db.model(MODEL_NAME).destroy({
    where: { orgId },
    force
  })
}

async function deleteAllSoftDeletedBefore(timestamp) {
  const db = getDb()

  return db.model(MODEL_NAME).destroy({
    where: {
      deletedAt: {
        [Op.lte]: timestamp
      }
    },
    force: true
  })
}

const DOCUMENT_PROPERTIES_FOR_DUPLICATION = ['name', 'slug', 'orgId', 'projectId']

async function duplicateById(id, orgId) {
  const db = getDb()

  const document = await db.model(MODEL_NAME).findOne({
    where: { id, orgId },
    attributes: DOCUMENT_PROPERTIES_FOR_DUPLICATION,
    raw: true
  })

  const createdDocument = await db.model(MODEL_NAME).create({
    ...document,
    name: `${document.name}_copy`,
    slug: `${document.slug}_copy`
  })

  return publicFields(createdDocument)
}

export default {
  createForProject,
  updateByIdForProject,
  findByIdForProject,
  findPublishedByIdForProject,
  findAllForProject,
  findAllPublishedForProject,
  deleteByIdForProject,
  findParentProjectByDocumentId,
  findByIdWithPublishedFields,
  findByIdWithFields,
  findById,
  deleteAllForOrg,
  deleteAllSoftDeletedBefore,
  duplicateById
}
