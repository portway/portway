/**
 * Note: DocumentVersion is currently not public facing via the API
 * If it gets endpoints in the future, it should handle public fields
 */
import { Op } from 'sequelize'
import { getDb } from '../db/dbConnector'

const MODEL_NAME = 'DocumentVersion'

async function createVersion(documentId, docName, docSlug, orgId) {
  const db = getDb()
  const latestVersion = await getLatestDocumentVersion(documentId, orgId)
  const versionNumber = latestVersion ? latestVersion.versionNumber + 1 : 1
  const version = await db.model(MODEL_NAME).create({ 
    versionNumber, documentId, orgId, name: docName, slug: docSlug
  })
  return version
}

async function getLatestDocumentVersion(documentId, orgId) {
  const db = getDb()
  return await db.model(MODEL_NAME).findOne({
    where: { documentId, orgId },
    attributes: ['versionNumber'],
    order: [['versionNumber', 'DESC']],
    raw: true
  })
}

async function deleteAllForDocument(documentId, orgId) {
  const db = getDb()
  return db.model(MODEL_NAME).destroy({
    where: { orgId, documentId }
  })
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

export default {
  createVersion,
  deleteAllForDocument,
  deleteAllForOrg,
  deleteAllSoftDeletedBefore
}