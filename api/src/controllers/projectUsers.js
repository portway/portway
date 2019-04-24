import Joi from 'joi'
import ono from 'ono'
import { validateBody, validateParams } from '../libs/middleware/payloadValidation'
import { requiredFields } from './payloadSchemas/helpers'
import BusinessProjectUser from '../businesstime/projectuser'
import crudPerms from '../libs/middleware/reqCrudPerms'
import RESOURCE_TYPES from '../constants/resourceTypes'

const { listPerm, readPerm, updatePerm, deletePerm, createPerm } = crudPerms(
  RESOURCE_TYPES.PROJECT_USER,
  (req) => { return { projectId: req.params.projectId } }
)

const bodySchema = Joi.compile(
  requiredFields(RESOURCE_TYPES.PROJECT_USER, 'userId', 'roleId')
)

const bodyUpdateSchema = Joi.compile({
  roleId: Joi.number()
})

const paramSchema = Joi.compile({
  projectId: Joi.number().required(),
  id: Joi.number()
})

const projectUsersController = function(router) {
  // all routes are nested at projects/:projectId/assignments and receive req.params.projectId
  router.get('/', validateParams(paramSchema), listPerm, getProjectUsers)
  router.post(
    '/',
    validateParams(paramSchema),
    validateBody(bodySchema),
    createPerm,
    createProjectUser
  )
  router.get('/:id', validateParams(paramSchema), readPerm, getProjectUser)
  router.put(
    '/:id',
    validateParams(paramSchema),
    validateBody(bodyUpdateSchema),
    updatePerm,
    updateProjectUser
  )
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
    const user = await BusinessProjectUser.findByIdAndProject(id, projectId, orgId)
    if (!user) throw ono({ code: 404 }, `No user with id ${id}`)
    res.json({ data: user })
  } catch (e) {
    console.error(e.stack)
    res.status(e.code || 500).json({ error: `error fetching document with id ${id}` })
  }
}

const createProjectUser = async (req, res) => {
  const { body } = req
  const { projectId } = req.params
  const { orgId } = req.requestorInfo

  try {
    const projectUser = await BusinessProjectUser.addUserIdToProject(
      body.userId,
      body.roleId,
      projectId,
      orgId
    )
    res.status(201).json({ data: projectUser })
  } catch (e) {
    console.error(e.stack)
    res.status(e.code || 500).json({ error: 'Cannot assign user to project' })
  }
}

const updateProjectUser = async (req, res) => {
  const { body } = req
  const { id } = req.params
  const { orgId } = req.requestorInfo

  try {
    const projectUser = await BusinessProjectUser.updateProjectUserById(
      id,
      body.roleId,
      orgId
    )
    res.status(200).json({ data: projectUser })
  } catch (e) {
    console.error(e.stack)
    res.status(e.code || 500).json({ error: 'Cannot assign user to project' })
  }
}

const deleteProjectUser = async function(req, res) {
  const { id, projectId } = req.params
  const { orgId } = req.requestorInfo

  try {
    await BusinessProjectUser.deleteByIdForProject(id, projectId, orgId)
    res.status(204).send()
  } catch (e) {
    console.error(e.stack)
    res.status(e.code || 500).json({ error: `Error removing user ${id} from project ${projectId}` })
  }
}

export default projectUsersController
