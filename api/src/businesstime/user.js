import ono from 'ono'

import { getDb } from '../db/dbConnector'
import { UniqueConstraintError, Op } from 'sequelize'
import resourceTypes from '../constants/resourceTypes'
import resourcePublicFields from '../constants/resourcePublicFields'
import { pick } from '../libs/utils'
import { ORGANIZATION_ROLE_IDS } from '../constants/roles'
import { getPaginationOptions, getSortOptions } from '../libs/queryFilters'

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

async function findSoftDeletedByEmail(email) {
  const db = getDb()
  return await db.model(MODEL_NAME).findOne({ where: { email }, paranoid: false, raw: true })
}

async function findById(id) {
  const db = getDb()
  return await db.model(MODEL_NAME).findByPk(id, { raw: true })
}

/**
 * Get sanitized, paginated/searched users
 * @param {String} orgId
 * @param {Object} options
 *    {Integer} page
 *    {Integer} perPage number of records per page
 *    {String} sortBy
 *    {String} sortMethod
 *    {String} nameSearch search user's names
 */
async function findAllSanitized(orgId, options) {
  const paginationOptions = getPaginationOptions(options.page, options.perPage)
  const sortOptions = getSortOptions(options.sortBy, options.sortMethod)
  const db = getDb()

  const query = {
    where: { orgId },
    ...sortOptions,
    ...paginationOptions
  }

  if (options.ids) {
    query.where = {
      ...query.where,
      id: options.ids
    }
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

async function findSanitizedById(id, orgId) {
  const db = getDb()
  const user = await db
    .model(MODEL_NAME)
    .findOne({ where: { id, orgId } })

  if (!user) return user
  return publicFields(user)
}

async function findAllUnverifiedOwners() {
  const db = getDb()
  const twoWeeksAgo = new Date(Date.now() - 12096e5) // 2 weeks in ms
  const users = await db.model(MODEL_NAME).findAll({
    where: {
      resetKey: {
        [Op.not]: null
      },
      password: {
        [Op.is]: null
      },
      orgRoleId: ORGANIZATION_ROLE_IDS.OWNER,
      createdAt: {
        [Op.lte]: twoWeeksAgo
      }
    }
  })

  return users
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

async function restoreSoftDeleted(id, resetKey, newOrgId, newRoleId) {
  const db = getDb()
  const user = await db.model(MODEL_NAME).findOne({ where: { id }, paranoid: false })

  if (!newOrgId) {
    throw ono({ code: 404 }, 'Restored user must be given a new org id')
  }

  if (!newRoleId) {
    throw ono({ code: 404 }, 'Restored user must be given a new role id')
  }

  if (!user) throw ono({ code: 404 }, `Cannot restore soft deleted user, user not found with id: ${id}`)

  user.setDataValue('deletedAt', null)
  user.setDataValue('password', null)
  user.setDataValue('pending', true)
  user.setDataValue('resetKey', resetKey)
  user.setDataValue('orgId', newOrgId)
  user.setDataValue('orgRoleId', newRoleId)

  const savedUser = await user.save({ paranoid: false })

  return publicFields(savedUser)
}

async function deleteById(id, orgId) {
  const db = getDb()
  const user = await db.model(MODEL_NAME).findOne({ where: { id, orgId } })

  if (!user) throw ono({ code: 404 }, `Cannot delete, user not found with id: ${id}`)
  //when deleting a user we first set the orgId to null, which will allow us to restore them later and assign to a new org
  await user.update({ orgId: null })

  await user.destroy()
}

async function countAll(orgId) {
  const db = getDb()
  const { count } = await db.model(MODEL_NAME).findAndCountAll({ where: { orgId } })
  return count
}

async function deleteAllForOrg(orgId, force = false) {
  const db = getDb()

  return db.model(MODEL_NAME).destroy({
    where: { orgId },
    force
  })
}

export default {
  create,
  findByEmail,
  findSoftDeletedByEmail,
  findById,
  findAllSanitized,
  findSanitizedById,
  findAllUnverifiedOwners,
  updateByEmail,
  updateById,
  updateOrgRole,
  restoreSoftDeleted,
  deleteById,
  countAll,
  deleteAllForOrg
}
