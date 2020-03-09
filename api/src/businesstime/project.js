import ono from 'ono'

import { getDb } from '../db/dbConnector'
import resourceTypes from '../constants/resourceTypes'
import resourcePublicFields from '../constants/resourcePublicFields'
import { pick } from '../libs/utils'
import PROJECT_ACCESS_LEVELS from '../constants/projectAccessLevels'
import { getPaginationOptions, getSortOptions } from '../libs/queryFilters'

const MODEL_NAME = 'Project'

const PUBLIC_FIELDS = resourcePublicFields[resourceTypes.PROJECT]

const publicFields = (instance) => {
  return pick(instance, PUBLIC_FIELDS)
}

async function create(body) {
  const db = getDb()
  const createdProject = await db.model(MODEL_NAME).create(body)
  return publicFields(createdProject)
}

async function findAll(orgId, options) {
  const paginationOptions = getPaginationOptions(options.page, options.perPage)
  const sortOptions = getSortOptions(options.sortBy, options.sortMethod)
  const db = getDb()

  const query = {
    where: { orgId },
    ...sortOptions,
    ...paginationOptions
  }

  const result = await db.model(MODEL_NAME).findAndCountAll(query)

  return { projects: result.rows.map(publicFields), count: result.count }
}

async function findById(id, orgId) {
  const db = getDb()
  return await db.model(MODEL_NAME).findOne({
    attributes: PUBLIC_FIELDS,
    where: { id, orgId },
    raw: true
  })
}

async function updateById(id, body, orgId) {
  const db = getDb()
  const project = await db.model(MODEL_NAME).findOne({ where: { id, orgId } })

  if (!project) throw ono({ code: 404 }, `Cannot update, project not found with id: ${id}`)

  const updatedProject = await project.update(body)
  return publicFields(updatedProject)
}

async function deleteById(id, orgId) {
  const db = getDb()
  const project = await db.model(MODEL_NAME).findOne({ where: { id, orgId } })

  if (!project) throw ono({ code: 404 }, `Cannot delete, project not found with id: ${id}`)

  await project.destroy()
}

async function findAllForUser(userId, orgId) {
  const db = getDb()

  const projects = await db.model(MODEL_NAME).findAll({
    where: db.or(
      db.or({ orgId, accessLevel: PROJECT_ACCESS_LEVELS.READ }, { orgId, accessLevel: PROJECT_ACCESS_LEVELS.WRITE }),
      { '$ProjectUsers.userId$': userId }
    ),
    include: [{
      model: db.model('ProjectUser'),
      where: { userId, orgId },
      required: false
    }]
  })

  return projects.map(publicFields)
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
  findById,
  findAll,
  updateById,
  deleteById,
  findAllForUser,
  deleteAllForOrg
}
