import ono from 'ono'
import Joi from '@hapi/joi'

import { validateBody, validateParams, validateQuery } from '../libs/middleware/payloadValidation'
import BusinessWebhook from '../businesstime/webhook'
// import BusinessOrganization from '../businesstime/organization'
import crudPerms from '../libs/middleware/reqCrudPerms'
import RESOURCE_TYPES from '../constants/resourceTypes'
import { requiredFields } from './payloadSchemas/helpers'
import webhookSchema from './payloadSchemas/webhook'
import auditLog, { auditActions } from '../integrators/audit'
// import { SORT_METHODS } from '../constants/queryOptions'

const { listPerm, readPerm, createPerm, deletePerm, updatePerm } = crudPerms(
  RESOURCE_TYPES.WEBHOOK,
  (req) => {
    return { projectId: req.params.projectId }
  }
)

const paramSchema = Joi.compile({
  projectId: Joi.number().required(),
  id: Joi.number()
})

// const querySchema = Joi.compile({
//   page: Joi.number(),
//   perPage: Joi.number(),
//   sortBy: Joi.string().valid('name', 'createdAt', 'createdBy'),
//   sortMethod: Joi.string().valid(SORT_METHODS.ASCENDING, SORT_METHODS.DESCENDING)
// })

const webhooksController = function (router) {
  router.post(
    '/',
    validateBody(requiredFields(RESOURCE_TYPES.WEBHOOK, 'url'), { includeDetails: true }),
    createPerm,
    addWebhook
  )
  router.get('/', listPerm, getProjectWebhooks)
  router.get('/:id', validateParams(paramSchema), readPerm, getWebhook)
  router.put(
    '/:id',
    validateParams(paramSchema),
    validateBody(webhookSchema, { includeDetails: true }),
    updatePerm,
    updateWebhook
  )
  router.delete('/:id', validateParams(paramSchema), deletePerm, deleteWebhook)
}

const getProjectWebhooks = async function (req, res, next) {
  try {
    const webhooks = await BusinessWebhook.findAllByProjectId(req.params.projectId, req.requestorInfo.orgId)
    res.json({ data: webhooks })
  } catch (e) {
    next(e)
  }
}

const getWebhook = async function (req, res, next) {
  const { id } = req.params

  try {
    const webhook = await BusinessWebhook.findById(id, req.requestorInfo.orgId)
    if (!webhook) throw ono({ code: 404 }, `No webhook with id ${id}`)
    res.json({ data: webhook })
  } catch (e) {
    next(e)
  }
}

const addWebhook = async function (req, res, next) {
  const { body } = req
  body.orgId = req.requestorInfo.orgId
  // overwrite any id they pass in with actual projectId from params, since param id is used for
  // access validation
  body.projectId = req.params.projectId

  try {
    const webhook = await BusinessWebhook.create(body)
    res.status(201).json({ data: webhook })
    auditLog({ userId: req.requestorInfo.requestorId, primaryModel: RESOURCE_TYPES.WEBHOOK, primaryId: webhook.id, action: auditActions.ADDED_PRIMARY })
  } catch (e) {
    next(e)
  }
}

const updateWebhook = async function (req, res, next) {
  const { id } = req.params
  const { body } = req

  body.orgId = req.requestorInfo.orgId

  try {
    console.log(JSON.stringify(body, null, 2))
    const webhook = await BusinessWebhook.updateById(id, body, req.requestorInfo.orgId)
    res.status(200).json({ data: webhook })
    auditLog({ userId: req.requestorInfo.requestorId, primaryModel: RESOURCE_TYPES.WEBHOOK, primaryId: webhook.id, action: auditActions.UPDATED_PRIMARY })
  } catch (e) {
    next(e)
  }
}

const deleteWebhook = async function (req, res, next) {
  const { id } = req.params

  try {
    await BusinessWebhook.deleteById(id, req.requestorInfo.orgId)
    res.status(204).send()
    auditLog({ userId: req.requestorInfo.requestorId, primaryModel: RESOURCE_TYPES.WEBHOOK, primaryId: id, action: auditActions.REMOVED_PRIMARY })
  } catch (e) {
    next(e)
  }
}

export default webhooksController
