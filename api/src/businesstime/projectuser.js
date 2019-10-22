import { getDb } from '../db/dbConnector'
import ono from 'ono'
import resourceTypes from '../constants/resourceTypes'
import resourcePublicFields from '../constants/resourcePublicFields'
import { pick } from '../libs/utils'

const MODEL_NAME = 'ProjectUser'

const PUBLIC_FIELDS = resourcePublicFields[resourceTypes.PROJECT_USER]

const publicFields = (instance) => {
  return pick(instance, PUBLIC_FIELDS)
}

async function create(body) {
  const db = getDb()
  const createdProjectUser = await db.model(MODEL_NAME).create(body)
  return createdProjectUser.get({ plain: true })
}

async function addUserIdToProject(userId, projectId, roleId, orgId, options = {}) {
  const db = getDb()

  const values = await Promise.all([
    db.model('Project').findOne({ where: { id: projectId, orgId } }),
    db.model('User').findOne({ where: { id: userId, orgId } })
  ])

  const project = values[0]
  const user = values[1]

  if (!project) {
    throw ono({ code: 404 }, `Project ${projectId} not found, cannot assign user ${userId}`)
  }

  if (!user) {
    throw ono({ code: 404 }, `User id ${userId} not found, cannot assign project ${projectId}`)
  }

  const result = await db.model(MODEL_NAME).findOrCreate({
    where: { projectId, orgId, userId, roleId },
    attributes: PUBLIC_FIELDS,
    raw: true
  })
  // findOrCreate returns [result, status]
  const projectUser = publicFields(result[0])

  if (options.includeUser) {
    const publicUser = pick(user, resourcePublicFields[resourceTypes.USER] )
    projectUser.user = publicUser
  }

  return projectUser
}

async function updateProjectUserById(id, roleId, orgId) {
  const db = getDb()

  const projectUser = await db.model(MODEL_NAME).findOne({ where: { id, orgId } })
  if (!projectUser) {
    throw ono({ code: 404 }, `Project user assignment id ${id} not found`)
  }
  return publicFields(
    await projectUser.update({
      roleId
    })
  )
}

async function findAllByProjectId(projectId, orgId, options = {}) {
  const db = getDb()
  const { includeUser } = options

  const query = {
    attributes: PUBLIC_FIELDS,
    where: {
      orgId,
      projectId
    }
  }

  if (includeUser) {
    query.include = {
      model: db.model('User')
    }
  }

  const projectUsers = await db.model(MODEL_NAME).findAll(query)

  return projectUsers.map((projectUser) => {
    const sanitizedUser = publicFields(projectUser)
    if (projectUser.User) {
      return {
        ...sanitizedUser,
        user: pick(projectUser.User, resourcePublicFields[resourceTypes.USER])
      }
    }
    return sanitizedUser
  })
}

async function findByIdAndProject(id, projectId, orgId) {
  const db = getDb()

  const projectUser = await db.model(MODEL_NAME).findOne({
    attributes: PUBLIC_FIELDS,
    where: { id, orgId, projectId },
    raw: true
  })

  if (!projectUser) {
    throw ono({ code: 404 }, `Project user assignment id ${id} not found for project ${projectId}`)
  }

  return projectUser
}

async function deleteByIdForProject(id, projectId, orgId) {
  const db = getDb()
  const projectUser = await db.model(MODEL_NAME).findOne({ where: { id, projectId, orgId } })

  if (!projectUser) {
    throw ono(
      { code: 404 },
      `Cannot delete, projectUser not found with id ${id} and project ${projectId}`
    )
  }

  await projectUser.destroy()
}

async function removeAllUsersFromProject(projectId, orgId) {
  const db = getDb()
  await db.model(MODEL_NAME).destroy({ where: { projectId, orgId } })
}

async function getProjectUserAssignment(userId, projectId, orgId) {
  const db = getDb()
  return await db.model(MODEL_NAME).findOne({
    attributes: PUBLIC_FIELDS,
    where: { userId, projectId, orgId }
  })
}

async function findAllProjectAssignmentsForUser(userId, orgId) {
  const db = getDb()
  return await db.model(MODEL_NAME).findAll({
    where: { userId, orgId },
    attributes: PUBLIC_FIELDS,
    raw: true
  })
}

async function removeAllProjectAssignmentsForUser(userId, orgId) {
  const db = getDb()
  await db.model(MODEL_NAME).destroy({ where: { userId, orgId } })
}

export default {
  create,
  addUserIdToProject,
  findAllByProjectId,
  findByIdAndProject,
  deleteByIdForProject,
  removeAllUsersFromProject,
  getProjectUserAssignment,
  updateProjectUserById,
  findAllProjectAssignmentsForUser,
  removeAllProjectAssignmentsForUser
}
