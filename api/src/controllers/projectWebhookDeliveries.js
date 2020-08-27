import Joi from '@hapi/joi'

import { validateParams, validateQuery } from '../libs/middleware/payloadValidation'
import BusinessWebhookDelivery from '../businesstime/webhookDelivery'
import crudPerms from '../libs/middleware/reqCrudPerms'
import RESOURCE_TYPES from '../constants/resourceTypes'

const { listPerm } = crudPerms(
  RESOURCE_TYPES.WEBHOOK,
  (req) => {
    return { projectId: req.params.projectId }
  }
)

const paramSchema = Joi.compile({
  projectId: Joi.number().required(),
  webhookId: Joi.number().required()
})

const querySchema = Joi.compile({
  page: Joi.number(),
  perPage: Joi.number().max(50)
})

const webhookDeliveriesController = function (router) {
  router.get('/', listPerm, validateQuery(querySchema), validateParams(paramSchema), getWebhookDeliveries)
}

const getWebhookDeliveries = async function (req, res, next) {
  try {
    const { page = 1, perPage = 50 } = req.query
    const options = { page, perPage }

    const { webhookDeliveries, count } = await BusinessWebhookDelivery.findAllByWebhookId(
      req.params.webhookId,
      options,
      req.requestorInfo.orgId
    )

    res.json({ 
      data: webhookDeliveries,
      page,
      perPage,
      total: count,
      totalPages: Math.ceil(count / perPage) 
    })
  } catch (e) {
    next(e)
  }
}

export default webhookDeliveriesController
