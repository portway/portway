import Joi from 'joi'
import ono from 'ono'
import { validateBody, validateParams } from '../libs/middleware/payloadValidation'
import BusinessDocument from '../businesstime/document'
import crudPerms from '../libs/middleware/reqCrudPerms'
import RESOURCE_TYPES from '../constants/resourceTypes'
import { requiredFields } from './payloadSchemas/helpers'
import documentSchema from './payloadSchemas/document'

const { listPerm, readPerm, createPerm, deletePerm, updatePerm } = crudPerms(
  RESOURCE_TYPES.DOCUMENT,
  req => {
    return { projectId: req.params.projectId }
  }
)

// TODO: this is currently piggybacking off of project perms

const paramSchema = Joi.compile({
  projectId: Joi.number().required(),
  id: Joi.number()
})

const projectDocumentsController = function(router) {
  // all routes are nested at projects/:projectId/documents and receive req.params.projectId
  router.post(
    '/',
    validateParams(paramSchema),
    validateBody(requiredFields(RESOURCE_TYPES.DOCUMENT, 'name')),
    createPerm,
    addProjectDocument
  )
  router.get('/', validateParams(paramSchema), listPerm, getProjectDocuments)
  router.get('/:id', validateParams(paramSchema), readPerm, getProjectDocument)
  router.put(
    '/:id',
    validateParams(paramSchema),
    validateBody(documentSchema),
    updatePerm,
    replaceProjectDocument
  )
  router.delete('/:id', validateParams(paramSchema), deletePerm, deleteProjectDocument)
}

const getProjectDocuments = async function(req, res) {
  const { projectId } = req.params
  const { orgId } = req.requestorInfo

  try {
    const documents = await BusinessDocument.findAllForProject(projectId, orgId)
    res.json({ data: documents })
  } catch (e) {
    console.error(e.stack)
    res.status(e.code || 500).json({ error: 'Cannot fetch documents' })
  }
}

const getProjectDocument = async function(req, res) {
  const { id, projectId } = req.params
  const { orgId } = req.requestorInfo

  try {
    const document = await BusinessDocument.findByIdForProject(id, projectId, orgId)
    if (!document) throw ono({ code: 404 }, `No document with id ${id}`)
    res.json({ data: document })
  } catch (e) {
    console.error(e.stack)
    res.status(e.code || 500).json({ error: `error fetching document with id ${id}` })
  }
}

const addProjectDocument = async function(req, res) {
  const { body } = req
  const { projectId } = req.params
  const { orgId } = req.requestorInfo
  // Overwrite orgId even if they passed anything in
  body.orgId = orgId

  try {
    const document = await BusinessDocument.createForProject(projectId, body)
    res.status(201).json({ data: document })
  } catch (e) {
    console.error(e.stack)
    res.status(e.code || 500).json({ error: 'Cannot create document' })
  }
}

const replaceProjectDocument = async function(req, res) {
  const { id, projectId } = req.params
  const { body } = req
  const { orgId } = req.requestorInfo

  try {
    const document = await BusinessDocument.updateByIdForProject(id, projectId, orgId, body)
    res.json({ data: document })
  } catch (e) {
    console.error(e.stack)
    res.status(e.code || 500).json({ error: `error updating document with id ${id}` })
  }
}

const deleteProjectDocument = async function(req, res) {
  const { id, projectId } = req.params
  const { orgId } = req.requestorInfo

  try {
    await BusinessDocument.deleteByIdForProject(id, projectId, orgId)
    res.status(204).send()
  } catch (e) {
    console.error(e.stack)
    res.status(e.code || 500).json({ error: `error deleting document with id ${id}` })
  }
}

export default projectDocumentsController
