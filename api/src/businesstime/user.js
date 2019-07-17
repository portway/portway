import ono from 'ono'

import { getDb } from '../db/dbConnector'
import { UniqueConstraintError } from 'sequelize'
import resourceTypes from '../constants/resourceTypes'
import resourcePublicFields from '../constants/resourcePublicFields'
import { pick } from '../libs/utils'
import { ORGANIZATION_ROLE_IDS } from '../constants/roles'

export const MODEL_NAME = 'User'

const PUBLIC_FIELDS = resourcePublicFields[resourceTypes.USER]

const publicFields = (instance) => {
  return pick(instance, PUBLIC_FIELDS)
}

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
  return createdUser && publicFields(createdUser)
}

async function findByEmail(email) {
  const db = getDb()
  const user = await db.model(MODEL_NAME).findOne({
    where: { email }
  })
  return user && user.get({ plain: true })
}

async function findById(id) {
  const db = getDb()
  return await db.model(MODEL_NAME).findByPk(id, { raw: true })
}

async function findAllSanitized(orgId, options) {
  const paginationOptions = getPaginationOptions(options.page, options.perPage)
  const db = getDb()

  const query = {
    where: { orgId },
    ...paginationOptions
  }

  if (options.nameSearch) {
    query.where = {
      [db.Op.and]: [
        {
          ...query.where
        }, {
          name: {
            [db.Op.iLike]: `%${options.nameSearch}%`
          }
        }
      ]
    }
  }

  const result = await db.model(MODEL_NAME).findAndCountAll(query)

  return { users: result.rows.map(publicFields), count: result.count }
}

function getPaginationOptions(page, perPage) {
  if (!page || !perPage) {
    return {}
  }

  return { limit: perPage, offset: (page - 1) * perPage }
}

async function findSanitizedById(id, orgId) {
  const db = getDb()
  const user = await db
    .model(MODEL_NAME)
    .findOne({ where: { id, orgId } })

  if (!user) return user
  return publicFields(user)
}

async function updateByEmail(email, body) {
  const db = getDb()
  const user = await db.model(MODEL_NAME).findOne({ where: { email } })
  if (!user) throw ono({ code: 404 }, `Cannot update, user not found with email: ${email}`)
  const updatedUser = await user.update(body)
  return updatedUser && publicFields(updatedUser)
}

async function updateById(id, body, orgId) {
  const db = getDb()
  const user = await db.model(MODEL_NAME).findOne({ where: { id, orgId } })
  if (!user) throw ono({ code: 404 }, `Cannot update, user not found with id: ${id}`)
  const updatedUser = await user.update(body)
  return updatedUser && publicFields(updatedUser)
}

async function updateOrgRole(id, orgRoleId, orgId) {
  const db = getDb()
  const user = await db.model(MODEL_NAME).findOne({ where: { id, orgId } })
  if (!user) throw ono({ code: 404 }, `Cannot update org role, user not found with id: ${id}`)

  if (user.orgRoleId === ORGANIZATION_ROLE_IDS.OWNER) {
    throw ono({ code: 404 }, 'Cannot change the role of an organization owner')
  }

  const updatedUser = await user.update({ orgRoleId })
  return updatedUser && publicFields(updatedUser)
}

async function deleteById(id, orgId) {
  const db = getDb()
  const user = await db.model(MODEL_NAME).findOne({ where: { id, orgId } })

  if (!user) throw ono({ code: 404 }, `Cannot delete, user not found with id: ${id}`)

  await user.destroy()
}

export default {
  create,
  findByEmail,
  findById,
  findAllSanitized,
  findSanitizedById,
  updateByEmail,
  updateById,
  updateOrgRole,
  deleteById
}
