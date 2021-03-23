import Joi from '@hapi/joi'
import multer from 'multer'

import { validateBody, validateParams } from '../libs/middleware/payloadValidation'
import BusinessField from '../businesstime/field'
import crudPerms from '../libs/middleware/reqCrudPerms'
import RESOURCE_TYPES from '../constants/resourceTypes'
import { MAX_FILE_SIZE_BYTES } from '../constants/fieldTypes'
import { requiredFields, partialFields } from './payloadSchemas/helpers'
import auditLog, { auditActions } from '../integrators/audit'
import fieldCoordinator from '../coordinators/field'

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
    multer({
      dest: 'uploads/',
      limits: {
        fileSize: MAX_FILE_SIZE_BYTES
      }
    }).single('file'),
    validateBody(requiredFields(RESOURCE_TYPES.FIELD, 'name', 'type'), { includeDetails: true }),
    createPerm,
    addDocumentField
  )
  router.get('/', validateParams(paramSchema), listPerm, getDocumentFields)
  router.get('/:id', validateParams(paramSchema), readPerm, getDocumentField)
  router.put(
    '/:id',
    validateParams(paramSchema),
    multer({
      dest: 'uploads/',
      limits: {
        fileSize: MAX_FILE_SIZE_BYTES
      }
    }).single('file'),
    validateBody(partialFields(RESOURCE_TYPES.FIELD, 'name', 'value', 'structuredValue', 'alt', 'alignment'), {
      includeDetails: true
    }),
    updatePerm,
    updateDocumentField
  )
  router.delete('/:id', validateParams(paramSchema), deletePerm, deleteDocumentField)
}

const getDocumentFields = async function(req, res, next) {
  const { documentId } = req.params
  const { orgId } = req.requestorInfo
  const { draft } = req.query

  const lookup = draft === 'true' ? 'findAllDraftForDocument' : 'findAllPublishedForDocument'

  try {
    const fields = await BusinessField[lookup](documentId, orgId)
    res.json({ data: fields })
  } catch (e) {
    next(e)
  }
}

const getDocumentField = async function(req, res, next) {
  const { id, documentId } = req.params
  const { orgId } = req.requestorInfo

  try {
    const field = await BusinessField.findByIdForDocument(id, documentId, orgId)
    res.json({ data: field })
  } catch (e) {
    next(e)
  }
}

const addDocumentField = async function(req, res, next) {
  const { body, file } = req
  const { documentId } = req.params
  const { orgId } = req.requestorInfo
  // Overwrite orgId even if they passed anything in
  body.orgId = orgId

  try {
    const field = await fieldCoordinator.addFieldToDocument(documentId, body, file)
    res.status(201).json({ data: field })
    auditLogDocumentUpdate(req.requestorInfo.requestorId, documentId)
  } catch (e) {
    next(e)
  }
}

const updateDocumentField = async function(req, res, next) {
  const { id, documentId } = req.params
  const { body, file } = req
  const { orgId } = req.requestorInfo

  try {
    const field = await fieldCoordinator.updateDocumentField(id, documentId, orgId, body, file)
    res.status(200).json({ data: field })
    auditLogDocumentUpdate(req.requestorInfo.requestorId, documentId)
  } catch (e) {
    next(e)
  }
}

const deleteDocumentField = async function(req, res, next) {
  const { id, documentId } = req.params
  const { orgId } = req.requestorInfo

  try {
    await fieldCoordinator.removeDocumentField(id, documentId, orgId)
    res.status(204).send()
    auditLogDocumentUpdate(req.requestorInfo.requestorId, documentId)
  } catch (e) {
    next(e)
  }
}

const auditLogDocumentUpdate = function(requestorId, documentId) {
  auditLog({ userId: requestorId, primaryModel: RESOURCE_TYPES.DOCUMENT, primaryId: documentId, action: auditActions.UPDATED_PRIMARY })
}

export default documentFields
