import { getDb } from '../db/dbConnector'
import fieldTypes from '../constants/fieldTypes'

async function create(type, value, orgId) {
  const db = getDb()

  const modelName = fieldTypes.FIELD_TYPE_MODELS[type]

  const createdFieldValue = await db.model(modelName).create({ orgId, value })
  return createdFieldValue.get({ plain: true })
}

export default {
  create
}
