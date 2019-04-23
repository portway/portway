import Joi from 'joi'
import ono from 'ono'

import { validateBody, validateParams } from '../libs/middleware/payloadValidation'
import BusinessField from '../businesstime/field'
import crudPerms from '../libs/middleware/reqCrudPerms'
import RESOURCE_TYPES from '../constants/resourceTypes'
import { requiredFields, partialFields } from './payloadSchemas/helpers'

const { listPerm, readPerm, createPerm, deletePerm, updatePerm } = crudPerms(
  RESOURCE_TYPES.DOCUMENT,
  (req) => {
    return { documentId: req.params.documentId }
  }
)

const paramSchema = Joi.compile({
  documentId: Joi.number().required(),
  id: Joi.number()
})

const documentFields = function(router) {
  // all routes are nested at documents/:documentId
  // and receive req.params.documentId
  router.post(
    '/',
    validateParams(paramSchema),
    validateBody(requiredFields(RESOURCE_TYPES.FIELD, 'name', 'type'), { includeDetails: true }),
    createPerm,
    addDocumentField
  )
  router.get('/', validateParams(paramSchema), listPerm, getDocumentFields)
  router.get('/:id', validateParams(paramSchema), readPerm, getDocumentField)
  router.put(
    '/:id',
    validateParams(paramSchema),
    validateBody(partialFields(RESOURCE_TYPES.FIELD, 'name', 'value', 'structuredValue'), { includeDetails: true }),
    updatePerm,
    updateDocumentField
  )
  router.delete('/:id', validateParams(paramSchema), deletePerm, deleteDocumentField)
}

const getDocumentFields = async function(req, res) {
  const { documentId } = req.params
  const { orgId } = req.requestorInfo

  try {
    const fields = await BusinessField.findAllForDocument(documentId, orgId)
    res.json({ data: fields })
  } catch (e) {
    console.error(e.stack)
    res.status(e.code || 500).json({ error: 'Cannot fetch fields' })
  }
}

const getDocumentField = async function(req, res) {
  const { id, documentId } = req.params
  const { orgId } = req.requestorInfo

  try {
    const field = await BusinessField.findByIdForDocument(id, documentId, orgId)
    if (!field) throw ono({ code: 404 }, `No field with id ${id}`)
    res.json({ data: field })
  } catch (e) {
    console.error(e.stack)
    res.status(e.code || 500).json({ error: `error fetching field with id ${id}` })
  }
}

const addDocumentField = async function(req, res) {
  const { body } = req
  const { documentId } = req.params
  const { orgId } = req.requestorInfo
  // Overwrite orgId even if they passed anything in
  body.orgId = orgId

  try {
    const field = await BusinessField.createForDocument(documentId, body)
    res.status(201).json({ data: field })
  } catch (e) {
    console.error(e.stack)
    const message = e.message || 'Cannot create field'
    res.status(e.code || 500).json({ error: message, errorType: e.errorType })
  }
}

const updateDocumentField = async function(req, res) {
  const { id, documentId } = req.params
  const { body } = req
  const { orgId } = req.requestorInfo

  try {
    const field = await BusinessField.updateByIdForDocument(id, documentId, orgId, body)
    res.status(200).json({ data: field })
  } catch (e) {
    console.error(e.stack)
    const message = e.message || `error updating field with id ${id}`
    res.status(e.code || 500).json({ error: message, errorType: e.errorType })
  }
}

const deleteDocumentField = async function(req, res) {
  const { id, documentId } = req.params
  const { orgId } = req.requestorInfo

  try {
    await BusinessField.deleteByIdForDocument(id, documentId, orgId)
    res.status(204).send()
  } catch (e) {
    console.error(e.stack)
    res.status(e.code || 500).json({ error: `error deleting field with id ${id}` })
  }
}

export default documentFields
