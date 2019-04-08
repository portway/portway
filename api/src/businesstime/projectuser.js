import { getDb } from '../db/dbConnector'
import ono from 'ono'
import { PUBLIC_FIELDS as USER_PUBLIC_FIELDS } from './user'

const MODEL_NAME = 'ProjectUser'

async function create(body) {
  const db = getDb()
  const createdProjectUser = await db.model(MODEL_NAME).create(body)
  return createdProjectUser.get({ plain: true })
}

async function addUserIdToProject(userId, projectId, orgId) {
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
    where: { projectId, orgId, userId },
    attributes: [],
    raw: true
  })
  // findOrCreate returns [result, status]
  return result[0]
}

async function findAllByProjectId(projectId, orgId) {
  const db = getDb()

  return db.model('User').findAll({
    attributes: USER_PUBLIC_FIELDS,
    include: [
      {
        model: db.model(MODEL_NAME),
        where: { projectId, orgId },
        attributes: []
      }
    ],
    raw: true
  })
}

async function findByUserIdForProject(userId, projectId, orgId) {
  const db = getDb()

  return db.model('User').findOne({
    attributes: USER_PUBLIC_FIELDS,
    where: { id: userId, orgId },
    include: [
      {
        model: db.model(MODEL_NAME),
        where: { projectId, orgId },
        attributes: []
      }
    ],
    raw: true
  })
}

async function deleteByUserIdForProject(userId, projectId, orgId) {
  const db = getDb()
  const projectUser = await db.model(MODEL_NAME).findOne({ where: { userId, projectId, orgId } })

  if (!projectUser) {
    throw ono(
      { code: 404 },
      `Cannot delete, projectUser not found with user id ${userId} and project id ${projectId}`
    )
  }

  await projectUser.destroy()
}

export default {
  create,
  addUserIdToProject,
  findAllByProjectId,
  findByUserIdForProject,
  deleteByUserIdForProject
}
