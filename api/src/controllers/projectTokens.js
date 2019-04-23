import Joi from 'joi'
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
  requiredFields(RESOURCE_TYPES.PROJECT_TOKEN, 'projectId', 'roleId', 'name')
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
    validateBody(bodySchema),
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

const getProjectTokens = async function(req, res) {
  const { projectId } = req.params
  const { orgId } = req.requestorInfo

  try {
    const projectTokens = await BusinessProjectToken.findAllByProjectId(projectId, orgId)
    res.json({ data: projectTokens })
  } catch (e) {
    console.error(e.stack)
    res.status(e.code || 500).json({ error: 'Cannot fetch project tokens' })
  }
}

const getProjectToken = async function(req, res) {
  const { id } = req.params
  const { orgId } = req.requestorInfo

  try {
    const user = await BusinessProjectToken.findById(id, orgId)
    if (!user) throw ono({ code: 404 }, `No token with id ${id}`)
    res.json({ data: user })
  } catch (e) {
    console.error(e.stack)
    res.status(e.code || 500).json({ error: `error fetching document with id ${id}` })
  }
}

const createProjectToken = async (req, res) => {
  const { body } = req
  const { orgId } = req.requestorInfo

  try {
    const token = await projectTokenCreator(body, orgId)
    res.status(201).json({ data: token })
  } catch (e) {
    console.error(e.stack)
    res.status(e.code || 500).json({ error: 'Cannot create project token' })
  }
}

const updateProjectToken = async (req, res) => {
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
    console.error(e.stack)
    res.status(e.code || 500).json({ error: 'Cannot update project token' })
  }
}

const deleteProjectToken = async function(req, res) {
  const { id, projectId } = req.params
  const { orgId } = req.requestorInfo

  try {
    await BusinessProjectToken.deleteById(id, orgId)
    res.status(204).send()
  } catch (e) {
    console.error(e.stack)
    res.status(e.code || 500).json({ error: `Error removing project token ${id} from project ${projectId}` })
  }
}

export default projectTokensController
