import Joi from 'joi'
import ono from 'ono'
import { validateParams } from '../libs/middleware/payloadValidation'
import BusinessDocument from '../businesstime/document'
import crudPerms from '../libs/middleware/reqCrudPerms'
import RESOURCE_TYPES from '../constants/resourceTypes'
import documentVersionCoordinator from '../coordinators/documentVersion'

const { readPerm, updatePerm } = crudPerms(
  RESOURCE_TYPES.DOCUMENT,
  (req) => {
    return { documentId: req.params.id }
  }
)

const paramSchema = Joi.compile({
  id: Joi.number().required()
})

const documentsController = function(router) {
  router.get('/:id', validateParams(paramSchema), readPerm, getDocument)
  router.post('/:id/publish', validateParams(paramSchema), updatePerm, publishDocument)
  router.post('/:id/unpublish', validateParams(paramSchema), updatePerm, unpublishDocument)
}

const getDocument = async function(req, res, next) {
  const { id } = req.params
  const { orgId } = req.requestorInfo
  const { draft } = req.query

  const lookup = draft === 'true' ? 'findByIdWithFields' : 'findByIdWithPublishedFields'

  try {
    const document = await BusinessDocument[lookup](id, orgId)
    if (!document) throw ono({ code: 404 }, `No document with id ${id}`)
    res.json({ data: document })
  } catch (e) {
    next(e)
  }
}

const publishDocument = async function(req, res) {
  const { id } = req.params
  const { orgId } = req.requestorInfo

  try {
    const document = await BusinessDocument.findById(id, orgId)
    const publishedDoc = await documentVersionCoordinator.publishDocumentVersion(
      document.id,
      document.projectId,
      orgId
    )
    res.json({ data: publishedDoc })
  } catch (e) {
    console.error(e.stack)
    res.status(e.code || 500).json({ error: `error publishing document with id ${id}` })
  }
}

const unpublishDocument = async function(req, res) {
  const { id } = req.params
  const { orgId } = req.requestorInfo

  try {
    const document = await BusinessDocument.findById(id, orgId)
    const unpublishedDoc = await documentVersionCoordinator.unpublishDocument(
      document.id,
      document.projectId,
      orgId
    )
    res.json({ data: unpublishedDoc })
  } catch (e) {
    console.error(e.stack)
    res.status(e.code || 500).json({ error: `error unpublishing document with id ${id}` })
  }
}

export default documentsController
