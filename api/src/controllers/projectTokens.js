import Joi from '@hapi/joi'
import ono from 'ono'
import { validateBody, validateParams } from '../libs/middleware/payloadValidation'
import { requiredFields } from './payloadSchemas/helpers'
import BusinessProjectToken from '../businesstime/projecttoken'
import crudPerms from '../libs/middleware/reqCrudPerms'
import RESOURCE_TYPES from '../constants/resourceTypes'
import { createProjectToken as projectTokenCreator } from '../coordinators/projectToken'

const { listPerm, readPerm, updatePerm, deletePerm, createPerm } = crudPerms(
  RESOURCE_TYPES.PROJECT_TOKEN,
  (req) => { return { projectId: req.params.projectId }}
)

const bodySchema = Joi.compile(
  requiredFields(RESOURCE_TYPES.PROJECT_TOKEN, 'roleId', 'name')
)

const bodyUpdateSchema = Joi.compile({
  name: Joi.string()
})

const paramSchema = Joi.compile({
  projectId: Joi.number().required(),
  id: Joi.number()
})

const projectTokensController = function(router) {
  // all routes are nested at projects/:projectId/tokens and receive req.params.projectId
  router.get('/', validateParams(paramSchema), listPerm, getProjectTokens)
  router.post(
    '/',
    validateParams(paramSchema),
    validateBody(bodySchema, { includeDetails: true }),
    createPerm,
    createProjectToken
  )
  router.get('/:id', validateParams(paramSchema), readPerm, getProjectToken)
  router.put(
    '/:id',
    validateParams(paramSchema),
    validateBody(bodyUpdateSchema),
    updatePerm,
    updateProjectToken
  )
  router.delete('/:id', validateParams(paramSchema), deletePerm, deleteProjectToken)
}

const getProjectTokens = async function(req, res, next) {
  const { projectId } = req.params
  const { orgId } = req.requestorInfo

  try {
    const projectTokens = await BusinessProjectToken.findAllByProjectId(projectId, orgId)
    res.json({ data: projectTokens })
  } catch (e) {
    next(e)
  }
}

const getProjectToken = async function(req, res, next) {
  const { id } = req.params
  const { orgId } = req.requestorInfo

  try {
    const user = await BusinessProjectToken.findById(id, orgId)
    if (!user) throw ono({ code: 404 }, `No token with id ${id}`)
    res.json({ data: user })
  } catch (e) {
    next(e)
  }
}

const createProjectToken = async (req, res, next) => {
  const { body } = req
  const { orgId } = req.requestorInfo
  body.projectId = req.params.projectId

  try {
    const token = await projectTokenCreator(body, orgId)
    res.status(201).json({ data: token })
  } catch (e) {
    next(e)
  }
}

const updateProjectToken = async (req, res, next) => {
  const { name } = req.body
  const { id } = req.params
  const { orgId } = req.requestorInfo

  try {
    const projectToken = await BusinessProjectToken.updateNameById(
      id,
      name,
      orgId
    )
    res.status(200).json({ data: projectToken })
  } catch (e) {
    next(e)
  }
}

const deleteProjectToken = async function(req, res, next) {
  const { id } = req.params
  const { orgId } = req.requestorInfo

  try {
    await BusinessProjectToken.deleteById(id, orgId)
    res.status(204).send()
  } catch (e) {
    next(e)
  }
}

export default projectTokensController
