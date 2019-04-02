import Joi from 'joi'
import ono from 'ono'
import { validateBody, validateParams } from '../libs/middleware/payloadValidation'
import BusinessField from '../businesstime/field'
import crudPerms from '../libs/middleware/reqCrudPerms'
import RESOURCE_TYPES from '../constants/resourceTypes'
import fieldTypes from '../constants/fieldTypes'

const { listPerm, readPerm, createPerm, deletePerm, updatePerm } = crudPerms(
  RESOURCE_TYPES.PROJECT,
  req => req.params.projectId
)

// TODO: this is currently piggybacking off of project perms
const bodySchema = Joi.compile({
  name: Joi.string().required(),
  docId: Joi.number().required(),
  projectId: Joi.number().required(),
  value: Joi.alternatives(Joi.string(), Joi.number()).required(),
  type: Joi.number()
    .valid(Object.values(fieldTypes.FIELD_TYPES))
    .required()
  // TODO order: need to decide how to handle this
})

const paramSchema = Joi.compile({
  projectId: Joi.number().required(),
  documentId: Joi.number().required(),
  id: Joi.number()
})

const projectDocumentsController = function(router) {
  // all routes are nested at projects/:projectId/documents/:documentId
  // and receive req.params.projectId and req.params.documentId
  router.post(
    '/',
    validateParams(paramSchema),
    validateBody(bodySchema),
    createPerm,
    addDocumentField
  )
  router.get('/', validateParams(paramSchema), listPerm, getDocumentFields)
  router.get('/:id', validateParams(paramSchema), readPerm, getDocumentField)
  router.put(
    '/:id',
    validateParams(paramSchema),
    validateBody(bodySchema),
    updatePerm,
    replaceDocumentField
  )
  router.delete('/:id', validateParams(paramSchema), deletePerm, deleteDocumentField)
}

const getDocumentFields = async function(req, res) {
  const { projectId, documentId } = req.params
  const { orgId } = req.requestorInfo

  try {
    const projects = await BusinessField.findAllForDocument(projectId, documentId, orgId)
    res.json(projects)
  } catch (e) {
    console.error(e.stack)
    res.status(e.code || 500).json({ error: 'Cannot fetch documents' })
  }
}

const getDocumentField = async function(req, res) {
  const { id, projectId, documentId } = req.params
  const { orgId } = req.requestorInfo

  try {
    const project = await BusinessField.findByIdForDocument(id, projectId, documentId, orgId)
    if (!project) throw ono({ code: 404 }, `No project with id ${id}`)
    res.json(project)
  } catch (e) {
    console.error(e.stack)
    res.status(e.code || 500).json({ error: `error fetching document with id ${id}` })
  }
}

const addDocumentField = async function(req, res) {
  const { body } = req
  const { projectId, documentId } = req.params
  const { orgId } = req.requestorInfo
  // Overwrite orgId even if they passed anything in
  body.orgId = orgId

  try {
    const project = await BusinessField.createForProjectDocument(projectId, documentId, body)
    res.status(201).json(project)
  } catch (e) {
    console.error(e.stack)
    res.status(e.code || 500).json({ error: 'Cannot create document' })
  }
}

const replaceDocumentField = async function(req, res) {
  const { id, projectId, documentId } = req.params
  const { body } = req
  const { orgId } = req.requestorInfo

  try {
    const project = await BusinessField.updateByIdForProjectDocument(
      id,
      projectId,
      documentId,
      orgId,
      body
    )
    res.json(project)
  } catch (e) {
    console.error(e.stack)
    res.status(e.code || 500).json({ error: `error updating document with id ${id}` })
  }
}

const deleteDocumentField = async function(req, res) {
  const { id, projectId, documentId } = req.params
  const { orgId } = req.requestorInfo

  try {
    await BusinessField.deleteByIdForDocument(id, projectId, documentId, orgId)
    res.status(204).send()
  } catch (e) {
    console.error(e.stack)
    res.status(e.code || 500).json({ error: `error deleting document with id ${id}` })
  }
}

export default projectDocumentsController
