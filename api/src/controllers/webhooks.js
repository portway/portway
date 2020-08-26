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
  router.get('/', validateQuery(querySchema), listPerm, getProjectWebhooks)
  router.get('/:id', validateParams(paramSchema), readPerm, getWebhook)
  router.put(
    '/:id',
    validateParams(paramSchema),
    validateBody(projectSchema, { includeDetails: true }),
    updatePerm,
    updateWebhook
  )
  router.delete('/:id', validateParams(paramSchema), deletePerm, deleteWebhook)
}

const getProjectWebhooks = async function (req, res, next) {
  const { page = 1, perPage = 50, sortBy, sortMethod } = req.query
  const options = { page, perPage, sortBy, sortMethod }

  try {
    const { projects, count } = await BusinessProject.findAll(req.requestorInfo.orgId, options)
    res.json({ data: projects, page, perPage, total: count, totalPages: Math.ceil(count / perPage) })
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
