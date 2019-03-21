import { getDb } from '../db/dbConnector'
import ono from 'ono'
import GLOBAL_PUBLIC_FIELDS from '../constants/globalPublicFields'

const MODEL_NAME = 'User'
const PUBLIC_FIELDS = [...GLOBAL_PUBLIC_FIELDS, 'firstName', 'lastName', 'email']

async function create(body) {
  const db = getDb()
  const createdUser = await db.model(MODEL_NAME).create(body)
  return createdUser.get({ plain: true })
}

async function findByEmail(email) {
  const db = getDb()
  const user = await db.model(MODEL_NAME).findOne({ where: { email } })
  return user && user.get({ plain: true })
}

// TODO convert to find all users within organization
async function findAllSanitized() {
  const db = getDb()
  
  return await db.model(MODEL_NAME).findAll({ attributes: PUBLIC_FIELDS, raw: true })
}

async function findSanitizedById(id) {
  const db = getDb()
  
  return await db.model(MODEL_NAME).findByPk(id, { attributes: PUBLIC_FIELDS, raw: true })
}

async function updateByEmail(email, body) {
  const db = getDb()
  const user = await db.model(MODEL_NAME).findOne({ where: { email } })
  if (!user) throw ono({ code: 404 }, `Cannot update, user not found with email: ${email}`)
  return await user.update(body, { raw: true })
}

export default {
  create,
  findByEmail,
  findAllSanitized,
  findSanitizedById,
  updateByEmail
}
