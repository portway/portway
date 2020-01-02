import Joi from 'joi'
import ono from 'ono'
import { validateBody, validateParams } from '../libs/middleware/payloadValidation'
import BusinessDocument from '../businesstime/document'
import crudPerms from '../libs/middleware/reqCrudPerms'
import RESOURCE_TYPES from '../constants/resourceTypes'
import { requiredFields } from './payloadSchemas/helpers'
import documentSchema from './payloadSchemas/document'
import auditLog, { auditActions } from '../integrators/audit'

const { listPerm, readPerm, createPerm, deletePerm, updatePerm } = crudPerms(
  RESOURCE_TYPES.DOCUMENT,
  (req) => {
    return { projectId: req.params.projectId }
  }
)

const paramSchema = Joi.compile({
  projectId: Joi.number().required(),
  id: Joi.number()
})

const projectDocumentsController = function(router) {
  // all routes are nested at projects/:projectId/documents and receive req.params.projectId
  router.post(
    '/',
    validateParams(paramSchema),
    validateBody(requiredFields(RESOURCE_TYPES.DOCUMENT, 'name'), { includeDetails: true }),
    createPerm,
    addProjectDocument
  )
  router.get('/', validateParams(paramSchema), listPerm, getProjectDocuments)
  router.get('/:id', validateParams(paramSchema), readPerm, getProjectDocument)
  router.put(
    '/:id',
    validateParams(paramSchema),
    validateBody(documentSchema, { includeDetails: true }),
    updatePerm,
    updateProjectDocument
  )
  router.delete('/:id', validateParams(paramSchema), deletePerm, deleteProjectDocument)
}

const getProjectDocuments = async function(req, res, next) {
  const { projectId } = req.params
  const { orgId } = req.requestorInfo
  const { draft, search } = req.query

  const options = search ? { search } : {}

  try {
    let documents
    if (draft === 'true') {
      // only passing search options for draft docs
      documents = await BusinessDocument.findAllForProject(projectId, orgId, options)
    } else {
      documents = await BusinessDocument.findAllPublishedForProject(projectId, orgId)
    }

    res.json({ data: documents })
  } catch (e) {
    next(e)
  }
}

const getProjectDocument = async function(req, res, next) {
  const { id, projectId } = req.params
  const { orgId } = req.requestorInfo
  const { draft } = req.query

  const lookup = draft === 'true' ? 'findByIdForProject' : 'findPublishedByIdForProject'

  try {
    const document = await BusinessDocument[lookup](id, projectId, orgId)
    if (!document) throw ono({ code: 404 }, `No document with id ${id}`)
    res.json({ data: document })
  } catch (e) {
    next(e)
  }
}

const addProjectDocument = async function(req, res, next) {
  const { body } = req
  const { projectId } = req.params
  const { orgId } = req.requestorInfo
  // Overwrite orgId even if they passed anything in
  body.orgId = orgId

  try {
    const document = await BusinessDocument.createForProject(projectId, body)
    res.status(201).json({ data: document })
    auditLog({ userId: req.requestorInfo.requestorId, primaryModel: RESOURCE_TYPES.DOCUMENT, primaryId: document.id, action: auditActions.ADDED_PRIMARY })
  } catch (e) {
    next(e)
  }
}

const updateProjectDocument = async function(req, res, next) {
  const { id, projectId } = req.params
  const { body } = req
  const { orgId } = req.requestorInfo

  try {
    const document = await BusinessDocument.updateByIdForProject(id, projectId, orgId, body)
    res.json({ data: document })
    auditLog({ userId: req.requestorInfo.requestorId, primaryModel: RESOURCE_TYPES.DOCUMENT, primaryId: document.id, action: auditActions.UPDATED_PRIMARY })
  } catch (e) {
    next(e)
  }
}

const deleteProjectDocument = async function(req, res, next) {
  const { id, projectId } = req.params
  const { orgId } = req.requestorInfo

  try {
    await BusinessDocument.deleteByIdForProject(id, projectId, orgId)
    res.status(204).send()
    auditLog({ userId: req.requestorInfo.requestorId, primaryModel: RESOURCE_TYPES.DOCUMENT, primaryId: id, action: auditActions.REMOVED_PRIMARY })
  } catch (e) {
    next(e)
  }
}

export default projectDocumentsController
