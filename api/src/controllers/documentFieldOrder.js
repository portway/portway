import Joi from '@hapi/joi'

import { validateBody, validateParams } from '../libs/middleware/payloadValidation'
import BusinessField from '../businesstime/field'
import crudPerms from '../libs/middleware/reqCrudPerms'
import RESOURCE_TYPES from '../constants/resourceTypes'
import { requiredFields } from './payloadSchemas/helpers'

const { updatePerm } = crudPerms(
  RESOURCE_TYPES.DOCUMENT,
  (req) => {
    return { documentId: req.params.documentId }
  }
)

const paramSchema = Joi.compile({
  documentId: Joi.number().required(),
  fieldId: Joi.number().required()
})

const documentFieldOrderController = function(router) {
  // all routes are nested at documents/:documentId/fields/:fieldId
  // and receive req.params.documentId and req.params.fieldId
  router.put(
    '/',
    validateParams(paramSchema),
    validateBody(requiredFields(RESOURCE_TYPES.FIELD_ORDER, 'order'), { includeDetails: true }),
    updatePerm,
    updateFieldOrder
  )
}

const updateFieldOrder = async function(req, res, next) {
  const { documentId, fieldId } = req.params
  const { order } = req.body
  const { orgId } = req.requestorInfo

  try {
    await BusinessField.updateOrderById(fieldId, documentId, orgId, order)
    res.status(204).send()
  } catch (e) {
    next(e)
  }
}

export default documentFieldOrderController
