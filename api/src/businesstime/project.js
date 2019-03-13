import { getDb } from '../db/db-connector'

const MODEL_NAME = 'Project'

async function findById(id) {
  const db = getDb()
  const project = await db.model(MODEL_NAME).findOne({ where: { id } })

  return project && project.get({ plain: true })
}

async function findAll(id) {
  const db = getDb()
  return await db.model(MODEL_NAME).findAll({}, { raw: true })
}

async function create(body) {
  const db = getDb()
  return await db.model(MODEL_NAME).create(body, { raw: true })
}

export default {
  findById,
  findAll,
  create
}
