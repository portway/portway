import Joi from 'joi'
import validate from '../libs/payloadValidation'
import { getDb } from '../db/db-connector'

const projectsPayloadSchema = Joi.compile({
  body: Joi.object().keys({
    name: Joi.string().required()
  })
})

const projectController = function(router) {
  router.post('/', validate(projectsPayloadSchema), addProject)
  router.get('/', getProjects)
  router.get('/:id', getProject)
}

const getProjects = async function(req, res) {
  const db = getDb()
  let projects
  try {
    projects = await db.model('Project').findAll({}, { raw: true })
    res.json(projects)
  } catch (e) {
    console.error(e)
    res.status(500).json({ error: 'Cannot fetch projects' })
  }
}

const getProject = async function(req, res) {
  const id = req.params.id
  const db = getDb()
  let project
  try {
    project = await db
      .model('Project')
      .findOne({ where: { id } }, { raw: true })
  } catch (e) {
    console.error(e)
    res
      .status(500)
      .json({ error: `error fetching project with id ${id}` })
  }
  res.json(project)
}

const addProject = async function(req, res) {
  const db = getDb()
  const { name } = req.body
  let project
  try {
    project = await db
      .model('Project')
      .create({ name }, { raw: true })
    res.json(project)
  } catch (e) {
    console.error(e)
    res.status(500).json({ error: 'Cannot create project' })
  }
}

export default projectController
