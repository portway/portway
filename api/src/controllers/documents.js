import Joi from 'joi'
import ono from 'ono'
import { validateParams } from '../libs/middleware/payloadValidation'
import BusinessDocument from '../businesstime/document'
import crudPerms from '../libs/middleware/reqCrudPerms'
import RESOURCE_TYPES from '../constants/resourceTypes'

const { readPerm } = crudPerms(
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
}

const getDocument = async function(req, res) {
  const { id } = req.params
  const { orgId } = req.requestorInfo
  const { draft } = req.query

  const lookup = draft === 'true' ? 'findByIdWithFields' : 'findByIdWithPublishedFields'

  try {
    const document = await BusinessDocument[lookup](id, orgId)
    if (!document) throw ono({ code: 404 }, `No document with id ${id}`)
    res.json({ data: document })
  } catch (e) {
    console.error(e.stack)
    res.status(e.code || 500).json({ error: `error fetching document with id ${id}` })
  }
}

export default documentsController
