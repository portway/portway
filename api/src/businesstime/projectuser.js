import { getDb } from '../db/dbConnector'
import ono from 'ono'

const MODEL_NAME = 'ProjectUser'

async function create(body) {
  const db = getDb()
  const createdProjectUser = await db.model(MODEL_NAME).create(body)
  return createdProjectUser.get({ plain: true })
}

async function addUserIdToProject(userId, projectId, roleId, orgId) {
  const db = getDb()

  const values = await Promise.all([
    db.model('Project').findOne({ where: { id: projectId, orgId } }),
    db.model('User').findOne({ where: { id: userId, orgId } })
  ])

  const project = values[0]
  const user = values[1]

  if (!project) {
    throw ono(
      { code: 404 },
      `Project ${projectId} not found, cannot assign user ${userId}`
    )
  }

  if (!user) {
    throw ono(
      { code: 404 },
      `User id ${userId} not found, cannot assign project ${projectId}`
    )
  }

  const result = await db.model(MODEL_NAME).findOrCreate({
    where: { projectId, orgId, userId, roleId },
    attributes: [],
    raw: true
  })
  // findOrCreate returns [result, status]
  return result[0]
}

async function updateProjectUserById(id, roleId, orgId) {
  const db = getDb()

  const projectUser = await db.model(MODEL_NAME).findOne({ where: { id, orgId } })
  if (!projectUser) {
    throw ono({ code: 404 }, `Project user assignment id ${id} not found`)
  }
  return await projectUser.update({
    roleId
  })
}

async function findAllByProjectId(projectId, orgId) {
  const db = getDb()

  return db.model(MODEL_NAME).findAll({
    where: {
      orgId,
      projectId
    },
    raw: true
  })
}

async function findByIdAndProject(id, projectId, orgId) {
  const db = getDb()

  const projectUser = await db.model(MODEL_NAME).findOne({
    where: { id, orgId, projectId }
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
  return await db.model(MODEL_NAME).findOne({ where: { userId, projectId, orgId } })
}

export default {
  create,
  addUserIdToProject,
  findAllByProjectId,
  findByIdAndProject,
  deleteByIdForProject,
  removeAllUsersFromProject,
  getProjectUserAssignment,
  updateProjectUserById
}
