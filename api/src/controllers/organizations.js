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

const getOrganization = async function(req, res) {
  const id = req.params.id

  try {
    const org = await BusinessOrganization.findById(id)
    if (!org) throw ono({ code: 404 }, `No organization with id ${id}`)
    res.json(org)
  } catch (e) {
    console.error(e.stack)
    res.status(e.code || 500).json({ error: `error fetching organization with id ${id}` })
  }
}

const addOrganization = async function(req, res) {
  const { name } = req.body

  try {
    const org = await BusinessOrganization.create({ name })
    res.status(201).json(org)
  } catch (e) {
    console.error(e.stack)
    res.status(e.code || 500).json({ error: 'Cannot create organization' })
  }
}

export default organizationsController
