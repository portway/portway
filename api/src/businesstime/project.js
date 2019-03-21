import { getDb } from '../db/dbConnector'
import ono from 'ono'

const MODEL_NAME = 'Project'

async function create(body) {
  const db = getDb()
  const createdProject = await db.model(MODEL_NAME).create(body)
  return createdProject.get({ plain: true })
}

async function findAll(id) {
  const db = getDb()
  return await db.model(MODEL_NAME).findAll({ raw: true })
}

async function findById(id) {
  const db = getDb()
  return await db.model(MODEL_NAME).findByPk(id, { raw: true })
}

async function updateById(id, body) {
  const db = getDb()
  const project = await db.model(MODEL_NAME).findByPk(id)

  if (!project) throw ono({ code: 404 }, `Cannot update, project not found with id: ${id}`)

  const updatedProject = await project.update(body)
  return updatedProject.get({ plain: true })
}

async function deleteById(id) {
  const db = getDb()
  const project = await db.model(MODEL_NAME).findByPk(id)

  if (!project) throw ono({ code: 404 }, `Cannot update, project not found with id: ${id}`)

  await project.destroy()
}

export default {
  create,
  findById,
  findAll,
  updateById,
  deleteById
}
