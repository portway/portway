import { getDb } from '../db/dbConnector'
import ono from 'ono'
import { PUBLIC_FIELDS as USER_PUBLIC_FIELDS } from './user'

const MODEL_NAME = 'ProjectUser'

async function create(body) {
  const db = getDb()
  const createdProjectUser = await db.model(MODEL_NAME).create(body)
  return createdProjectUser.get({ plain: true })
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

// async function findAllByUserId(userId, orgId) {
//   const db = getDb()
//   return await db.model(MODEL_NAME).findOne({ where: { userId, orgId }, raw: true })
// }

async function deleteByUserIdProjectId(userId, projectId, orgId) {
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
  findAllByProjectId,
  // findAllByUserId,
  deleteByUserIdProjectId
}
