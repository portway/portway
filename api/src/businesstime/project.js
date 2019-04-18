import { getDb } from '../db/dbConnector'
import ono from 'ono'
import resourceTypes from '../constants/resourceTypes'
import resourcePublicFields from '../constants/resourcePublicFields'
import { pick } from '../libs/utils'

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

async function findAll(orgId) {
  const db = getDb()
  return await db.model(MODEL_NAME).findAll({
    attributes: PUBLIC_FIELDS,
    where: { orgId },
    raw: true
  })
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

export default {
  create,
  findById,
  findAll,
  updateById,
  deleteById
}
