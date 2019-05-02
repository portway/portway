import { getDb } from '../db/dbConnector'
import ono from 'ono'
import { pick } from '../libs/utils'
import resourceTypes from '../constants/resourceTypes'
import resourcePublicFields from '../constants/resourcePublicFields'

const MODEL_NAME = 'DocumentVersion'

async function createVersion(docId, orgId, body) {
  const db = getDb()
  const version = await db.model(MODEL_NAME).create({ ...body, orgId })
  return version
}

export default {
  createVersion
}