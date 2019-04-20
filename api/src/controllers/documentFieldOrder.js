import Joi from 'joi'

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

const updateFieldOrder = async function(req, res) {
  const { documentId, fieldId } = req.params
  const { order } = req.body
  const { orgId } = req.requestorInfo

  try {
    const field = await BusinessField.updateOrderById(fieldId, documentId, orgId, order)
    res.status(200).json({ data: field })
  } catch (e) {
    console.error(e.stack)
    const message = e.message || `error updating field order with id ${fieldId}`
    res.status(e.code || 500).json({ error: message, errorType: e.errorType })
  }
}

export default documentFieldOrderController
