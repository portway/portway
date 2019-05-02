/**
 * Note: DocumentVersion is currently not public facing via the API
 * If it gets endpoints in the future, it should handle public fields
 */
import { getDb } from '../db/dbConnector'

const MODEL_NAME = 'DocumentVersion'

async function createVersion(docId, orgId) {
  const db = getDb()
  const latestVersion = await getLatestDocumentVersion(docId, orgId)
  const versionNumber = latestVersion ? latestVersion.versionNumber + 1 : 1
  const version = await db.model(MODEL_NAME).create({ versionNumber, docId, orgId })
  return version
}

async function getLatestDocumentVersion(docId, orgId) {
  const db = getDb()
  return await db.model(MODEL_NAME).findOne({
    where: { docId, orgId },
    attributes: ['versionNumber'],
    order: [['versionNumber', 'DESC']],
    raw: true
  })
}

export default {
  createVersion
}