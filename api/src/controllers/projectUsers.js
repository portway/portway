import Joi from '@hapi/joi'
import ono from 'ono'
import { validateBody, validateParams, validateQuery } from '../libs/middleware/payloadValidation'
import { partialFields, requiredFields } from './payloadSchemas/helpers'
import BusinessProjectUser from '../businesstime/projectuser'
import crudPerms from '../libs/middleware/reqCrudPerms'
import RESOURCE_TYPES from '../constants/resourceTypes'
import auditLog, { auditActions } from '../integrators/audit'

const { listPerm, readPerm, updatePerm, deletePerm, createPerm } = crudPerms(
  RESOURCE_TYPES.PROJECT_USER,
  (req) => { return { projectId: req.params.projectId } }
)

const bodySchema = requiredFields(RESOURCE_TYPES.PROJECT_USER, 'userId', 'roleId')

const paramSchema = Joi.compile({
  projectId: Joi.number().required(),
  id: Joi.number()
})

const querySchema = Joi.compile({
  includeUser: Joi.boolean().default(false)
})

const projectUsersController = function(router) {
  // all routes are nested at projects/:projectId/assignments and receive req.params.projectId
  router.get('/', validateParams(paramSchema), validateQuery(querySchema), listPerm, getProjectUsers)
  router.post(
    '/',
    validateParams(paramSchema),
    validateBody(bodySchema, { includeDetails: true }),
    validateQuery(querySchema),
    createPerm,
    createProjectUser
  )
  router.get(
    '/:id',
    validateParams(paramSchema),
    validateQuery(querySchema),
    readPerm,
    getProjectUser
  )
  router.put(
    '/:id',
    validateParams(paramSchema),
    validateBody(requiredFields(RESOURCE_TYPES.PROJECT_USER, 'roleId')),
    validateBody(partialFields(RESOURCE_TYPES.PROJECT_USER, 'roleId')),
    updatePerm,
    updateProjectUser
  )
  router.delete('/:id', validateParams(paramSchema), deletePerm, deleteProjectUser)
}

const getProjectUsers = async function(req, res, next) {
  const { projectId } = req.params
  const { orgId } = req.requestorInfo
  const { includeUser } = req.query

  try {
    const projectUsers = await BusinessProjectUser.findAllByProjectId(projectId, orgId, { includeUser })
    res.json({ data: projectUsers })
  } catch (e) {
    next(e)
  }
}

const getProjectUser = async function(req, res, next) {
  const { id, projectId } = req.params
  const { orgId } = req.requestorInfo

  try {
    const user = await BusinessProjectUser.findByIdAndProject(id, projectId, orgId)
    if (!user) throw ono({ code: 404 }, `No user with id ${id}`)
    res.json({ data: user })
  } catch (e) {
    next(e)
  }
}

const createProjectUser = async (req, res, next) => {
  const { body } = req
  const { projectId } = req.params
  const { orgId } = req.requestorInfo
  const { includeUser } = req.query

  try {
    const projectUser = await BusinessProjectUser.addUserIdToProject(
      body.userId,
      projectId,
      body.roleId,
      orgId,
      { includeUser }
    )
    res.status(201).json({ data: projectUser })
    auditLog({
      userId: req.requestorInfo.requestorId,
      primaryModel: RESOURCE_TYPES.USER,
      primaryId: body.userId,
      secondaryModel: RESOURCE_TYPES.PROJECT,
      secondaryId: projectId,
      action: auditActions.ADDED_PRIMARY_TO_SECONDARY
    })
  } catch (e) {
    next(e)
  }
}

const updateProjectUser = async (req, res, next) => {
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
    next(e)
  }
}

const deleteProjectUser = async function(req, res, next) {
  const { id, projectId } = req.params
  const { orgId } = req.requestorInfo

  try {
    await BusinessProjectUser.deleteByIdForProject(id, projectId, orgId)
    res.status(204).send()
    auditLog({
      userId: req.requestorInfo.requestorId,
      primaryModel: RESOURCE_TYPES.USER,
      primaryId: id,
      secondaryModel: RESOURCE_TYPES.PROJECT,
      secondaryId: projectId,
      action: auditActions.REMOVED_PRIMARY_FROM_SECONDARY
    })
  } catch (e) {
    next(e)
  }
}

export default projectUsersController
