import Joi from 'joi'
import ono from 'ono'
import { validateBody, validateParams } from '../libs/middleware/payloadValidation'
import { requiredFields } from './payloadSchemas/helpers'
import BusinessProjectUser from '../businesstime/projectuser'
import crudPerms from '../libs/middleware/reqCrudPerms'
import RESOURCE_TYPES from '../constants/resourceTypes'

const { listPerm, readPerm, updatePerm, deletePerm } = crudPerms(
  RESOURCE_TYPES.PROJECT,
  req => req.params.projectId
)

// TODO: this is currently piggybacking off of project perms,
// does it need its own, or will it always be the same?

const bodySchema = Joi.compile({
  users: Joi.array()
    .required()
    .items(requiredFields('user', 'id'))
})

const paramSchema = Joi.compile({
  projectId: Joi.number().required(),
  id: Joi.number()
})

const projectUsersController = function(router) {
  // all routes are nested at projects/:projectId/users and receive req.params.projectId
  router.get('/', validateParams(paramSchema), listPerm, getProjectUsers)
  router.get('/:id', validateParams(paramSchema), readPerm, getProjectUser)
  router.put(
    '/:id',
    validateParams(paramSchema),
    validateBody(bodySchema),
    updatePerm,
    addProjectUsers
  )
  router.delete('/:id', validateParams(paramSchema), deletePerm, deleteProjectUsers)
}

const getProjectUsers = async function(req, res) {
  const { projectId } = req.params
  const { orgId } = req.requestorInfo

  try {
    const projectUsers = await BusinessProjectUser.findAllByProjectId(projectId, orgId)
    res.json(projectUsers)
  } catch (e) {
    console.error(e.stack)
    res.status(e.code || 500).json({ error: 'Cannot fetch project users' })
  }
}

const getProjectUser = async function(req, res) {
  const { id, projectId } = req.params
  const { orgId } = req.requestorInfo

  try {
    const project = await BusinessProjectUser.findByIdForProject(id, projectId, orgId)
    if (!project) throw ono({ code: 404 }, `No project with id ${id}`)
    res.json(project)
  } catch (e) {
    console.error(e.stack)
    res.status(e.code || 500).json({ error: `error fetching document with id ${id}` })
  }
}

const addProjectUsers = async function(req, res) {
  const { body } = req
  const { projectId } = req.params
  const { orgId } = req.requestorInfo
  // Overwrite orgId even if they passed anything in
  body.orgId = orgId

  try {
    const project = await BusinessProjectUser.createForProject(projectId, body)
    res.status(201).json(project)
  } catch (e) {
    console.error(e.stack)
    res.status(e.code || 500).json({ error: 'Cannot create document' })
  }
}

const deleteProjectUsers = async function(req, res) {
  const { id, projectId } = req.params
  const { orgId } = req.requestorInfo

  try {
    await BusinessProjectUser.deleteByIdForProject(id, projectId, orgId)
    res.status(204).send()
  } catch (e) {
    console.error(e.stack)
    res.status(e.code || 500).json({ error: `error deleting document with id ${id}` })
  }
}

export default projectUsersController
