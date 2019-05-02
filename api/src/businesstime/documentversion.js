/**
 * Note: DocumentVersion is currently not public facing via the API
 * If it gets endpoints in the future, it should handle public fields
 */
import { getDb } from '../db/dbConnector'

const MODEL_NAME = 'DocumentVersion'

async function createVersion(docId, orgId) {
  const db = getDb()
  // TODO: get next version number
  const versionNumber = 1
  const version = await db.model(MODEL_NAME).create({ versionNumber, docId, orgId })
  return version
}

export default {
  createVersion
}