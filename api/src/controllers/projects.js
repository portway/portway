import Joi from 'joi'
import validate from '../libs/payloadValidation'
import BusinessProject from '../businesstime/project'
import ono from 'ono'

const projectsPayloadSchema = Joi.compile({
  body: Joi.object().keys({
    name: Joi.string().required(),
    description: Joi.string()
  })
})

const projectsController = function(router) {
  router.post('/', validate(projectsPayloadSchema), addProject)
  router.get('/', getProjects)
  router.get('/:id', getProject)
  router.put('/:id', validate(projectsPayloadSchema), replaceProject)
  router.delete('/:id', deleteProject)
}

const getProjects = async function(req, res) {
  try {
    const projects = await BusinessProject.findAll()
    res.json(projects)
  } catch (e) {
    console.error(e.stack)
    res.status(e.code || 500).json({ error: 'Cannot fetch projects' })
  }
}

const getProject = async function(req, res) {
  const { id } = req.params

  try {
    const project = await BusinessProject.findById(id)
    if (!project) throw ono({ code: 404 }, `No project with id ${id}`)
    res.json(project)
  } catch (e) {
    console.error(e.stack)
    res.status(e.code || 500).json({ error: `error fetching project with id ${id}` })
  }
}

const addProject = async function(req, res) {
  const { body } = req

  try {
    const project = await BusinessProject.create(body)
    res.status(201).json(project)
  } catch (e) {
    console.error(e.stack)
    res.status(e.code || 500).json({ error: 'Cannot create project' })
  }
}

const replaceProject = async function(req, res) {
  const { id } = req.params
  const { body } = req

  try {
    const project = await BusinessProject.updateById(id, body)
    res.json(project)
  } catch (e) {
    console.error(e.stack)
    res.status(e.code || 500).json({ error: `error updating project with id ${id}` })
  }
}

const deleteProject = async function(req, res) {
  const { id } = req.params

  try {
    await BusinessProject.deleteById(id)
    res.status(204).send()
  } catch (e) {
    console.error(e.stack)
    res.status(e.code || 500).json({ error: `error patching project with id ${id}` })
  }
}

export default projectsController
