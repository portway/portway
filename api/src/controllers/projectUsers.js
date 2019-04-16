import Joi from 'joi'
import ono from 'ono'
import { validateBody, validateParams } from '../libs/middleware/payloadValidation'
import { requiredFields } from './payloadSchemas/helpers'
import BusinessProjectUser from '../businesstime/projectuser'
import crudPerms from '../libs/middleware/reqCrudPerms'
import RESOURCE_TYPES from '../constants/resourceTypes'

const { listPerm, readPerm, updatePerm, deletePerm } = crudPerms(
  RESOURCE_TYPES.PROJECT_USER,
  (req) => { return { projectId: req.params.projectId } }
)

// Uses project-level permissions

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
  router.put(
    '/',
    validateParams(paramSchema),
    validateBody(bodySchema),
    updatePerm,
    addProjectUsers
  )
  router.delete(
    '/',
    validateParams(paramSchema),
    validateBody(bodySchema),
    deletePerm,
    removeProjectUsers
  )
  router.get('/:id', validateParams(paramSchema), readPerm, getProjectUser)
  router.delete('/:id', validateParams(paramSchema), deletePerm, deleteProjectUser)
}

const getProjectUsers = async function(req, res) {
  const { projectId } = req.params
  const { orgId } = req.requestorInfo

  try {
    const projectUsers = await BusinessProjectUser.findAllByProjectId(projectId, orgId)
    res.json({ data: projectUsers })
  } catch (e) {
    console.error(e.stack)
    res.status(e.code || 500).json({ error: 'Cannot fetch project users' })
  }
}

const getProjectUser = async function(req, res) {
  const { id, projectId } = req.params
  const { orgId } = req.requestorInfo

  try {
    const user = await BusinessProjectUser.findByUserIdForProject(id, projectId, orgId)
    if (!user) throw ono({ code: 404 }, `No user with id ${id}`)
    res.json({ data: user })
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
  body.users.forEach((user) => {
    user.orgId = orgId
  })

  try {
    await Promise.all(
      body.users.map(u => BusinessProjectUser.addUserIdToProject(u.id, projectId, orgId))
    )
    res.status(201).json({})
  } catch (e) {
    console.error(e.stack)
    res.status(e.code || 500).json({ error: 'Cannot assign users to project' })
  }
}

const removeProjectUsers = async function(req, res) {
  const { body } = req
  const { projectId } = req.params
  const { orgId } = req.requestorInfo

  try {
    await Promise.all(
      body.users.map(u => BusinessProjectUser.deleteByUserIdForProject(u.id, projectId, orgId))
    )
    res.status(204).send()
  } catch (e) {
    console.error(e.stack)
    res.status(e.code || 500).json({ error: 'Cannot remove users from project' })
  }
}

const deleteProjectUser = async function(req, res) {
  const { id, projectId } = req.params
  const { orgId } = req.requestorInfo

  try {
    await BusinessProjectUser.deleteByUserIdForProject(id, projectId, orgId)
    res.status(204).send()
  } catch (e) {
    console.error(e.stack)
    res.status(e.code || 500).json({ error: `Error removing user ${id} from project ${projectId}` })
  }
}

export default projectUsersController
