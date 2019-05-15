import Joi from 'joi'
import ono from 'ono'
import { validateParams } from '../libs/middleware/payloadValidation'
import BusinessDocument from '../businesstime/document'
import crudPerms from '../libs/middleware/reqCrudPerms'
import RESOURCE_TYPES from '../constants/resourceTypes'
import PUBLIC_MESSAGES from '../constants/publicMessages'

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

const getDocument = async function(req, res, next) {
  const { id } = req.params
  const { orgId } = req.requestorInfo

  try {
    const document = await BusinessDocument.findByIdWithFields(id, orgId)
    if (!document) throw ono({ code: 404 }, `No document with id ${id}`)
    res.json({ data: document })
  } catch (e) {
    next(e)
  }
}

export default documentsController
