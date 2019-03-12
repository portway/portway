import Joi from 'joi'
import validate from '../libs/payloadValidation'
import BusinessProject from '../businesstime/project'
import ono from 'ono'

const projectsPayloadSchema = Joi.compile({
  body: Joi.object().keys({
    name: Joi.string().required()
  })
})

const projectsController = function(router) {
  router.post('/', validate(projectsPayloadSchema), addProject)
  router.get('/', getProjects)
  router.get('/:id', getProject)
}

const getProjects = async function(req, res) {
  try {
    const projects = await BusinessProject.findAll()
    throw new Error('blarp')
    res.json(projects)
  } catch (e) {
    console.error(e.stack)
    res.status(e.code || 500).json({ error: 'Cannot fetch projects' })
  }
}

const getProject = async function(req, res) {
  const id = req.params.id

  try {
    const project = await BusinessProject.findById(id)
    if (!project) throw ono({ code: 404 }, `No project with id ${id}`)
    res.json(project)
  } catch (e) {
    console.error(e.stack)
    res
      .status(e.code || 500)
      .json({ error: `error fetching project with id ${id}` })
  }
}

const addProject = async function(req, res) {
  const { name } = req.body

  try {
    const project = await BusinessProject.create({ name })
    res.status(201).json(project)
  } catch (e) {
    console.error(e.stack)
    res.status(e.code || 500).json({ error: 'Cannot create project' })
  }
}

export default projectsController
