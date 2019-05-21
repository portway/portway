import Joi from 'joi'
import { validateBody } from '../libs/middleware/payloadValidation'
import BusinessOrganization from '../businesstime/organization'
import ono from 'ono'

const organizationsPayloadSchema = Joi.compile({
  name: Joi.string().required()
})

const organizationsController = function(router) {
  router.post('/', validateBody(organizationsPayloadSchema), addOrganization)
  router.get('/:id', getOrganization)
}

const getOrganization = async function(req, res, next) {
  const id = req.params.id

  try {
    const org = await BusinessOrganization.findSanitizedById(id)
    if (!org) throw ono({ code: 404 }, `No organization with id ${id}`)
    res.json({ data: org })
  } catch (e) {
    next(e)
  }
}

const addOrganization = async function(req, res, next) {
  const { name } = req.body

  try {
    const org = await BusinessOrganization.create({ name })
    res.status(201).json({ data: org })
  } catch (e) {
    next(e)
  }
}

export default organizationsController
