import { getDb } from '../db/dbConnector'
import ono from 'ono'
import GLOBAL_PUBLIC_FIELDS from '../constants/globalPublicFields'
import { UniqueConstraintError } from 'sequelize'

export const MODEL_NAME = 'User'

export const PUBLIC_FIELDS = [...GLOBAL_PUBLIC_FIELDS,
  'firstName', 'lastName', 'email', 'orgRoleId', 'orgId']

async function create(body) {
  const db = getDb()
  let createdUser
  try {
    createdUser = await db.model(MODEL_NAME).create(body)
  } catch (err) {
    if (err instanceof UniqueConstraintError) {
      throw ono({ code: 409 }, 'Cannot create user, duplicate value error')
    }
    throw err
  }
  return createdUser && createdUser.get({ plain: true })
}

async function findByEmail(email) {
  const db = getDb()
  const user = await db.model(MODEL_NAME).findOne({ where: { email } })
  return user && user.get({ plain: true })
}

async function findById(id) {
  const db = getDb()
  return await db.model(MODEL_NAME).findByPk(id, { raw: true })
}

async function findAllSanitized(orgId) {
  const db = getDb()
  return await db.model(MODEL_NAME).findAll({
    attributes: PUBLIC_FIELDS,
    where: { orgId },
    raw: true
  })
}

async function findSanitizedById(id, orgId) {
  const db = getDb()
  return await db
    .model(MODEL_NAME)
    .findOne({ attributes: PUBLIC_FIELDS, where: { id, orgId }, raw: true })
}

async function updateByEmail(email, body) {
  const db = getDb()
  const user = await db.model(MODEL_NAME).findOne({ where: { email } })
  if (!user) throw ono({ code: 404 }, `Cannot update, user not found with email: ${email}`)
  const updatedUser = await user.update(body)
  return updatedUser && updatedUser.get({ plain: true })
}

async function updateById(id, body) {
  const db = getDb()
  const user = await db.model(MODEL_NAME).findByPk(id)
  if (!user) throw ono({ code: 404 }, `Cannot update, user not found with id: ${id}`)
  const updatedUser = await user.update(body)
  return updatedUser && updatedUser.get({ plain: true })
}

export default {
  create,
  findByEmail,
  findById,
  findAllSanitized,
  findSanitizedById,
  updateByEmail,
  updateById
}
