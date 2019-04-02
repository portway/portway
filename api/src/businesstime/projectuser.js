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
  // TODO: sanitize input 100% here, or make sure Joi is doing it correctly
  // Can't be inserting raw user input into sql queries #littlebobbytables
  const db = getDb()
  const selectAttributes = USER_PUBLIC_FIELDS.map(field => `u."${field}"`).join(',')

  const query = []
  query.push(`SELECT ${selectAttributes}`)
  query.push('FROM "ProjectsUsers" pu')
  query.push('LEFT JOIN "Users" u ON u.id = pu."userId"')
  query.push(`WHERE pu."projectId" = ${projectId} AND pu."orgId" = ${orgId}`)
  return await db.query(query.join(' '), { type: db.QueryTypes.SELECT })
}

async function findAllByUserId(userId, orgId) {
  const db = getDb()
  return await db.model(MODEL_NAME).findOne({ where: { userId, orgId }, raw: true })
}

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
  findAllByUserId,
  deleteByUserIdProjectId
}
