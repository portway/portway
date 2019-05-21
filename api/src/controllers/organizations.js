import Joi from 'joi'
import ono from 'ono'

import { validateBody, validateParams } from '../libs/middleware/payloadValidation'
import BusinessOrganization from '../businesstime/organization'
import perms from '../libs/middleware/reqPermissionsMiddleware'
import crudPerms from '../libs/middleware/reqCrudPerms'
import RESOURCE_TYPES from '../constants/resourceTypes'
import ACTIONS from '../constants/actions'

const paramSchema = Joi.compile({
  id: Joi.number().required()
})

const organizationsPayloadSchema = Joi.compile({
  name: Joi.string().required()
})

const { readPerm } = crudPerms(
  RESOURCE_TYPES.ORGANIZATION,
  (req) => { return { id: req.params.id } }
)

const conditionalReadPerm = (req, res, next) => {
  const { id } = req.params
  // if ids match use the 'READ_MY' user perm
  if (id === req.requestorInfo.orgId) {
    return perms((req) => {
      return {
        resourceType: RESOURCE_TYPES.ORGANIZATION,
        action: ACTIONS.READ_MY
      }
    })(req, res, next)
  }
  // not requesting self, normal organization read perm
  return readPerm(req, res, next)
}

const organizationsController = function(router) {
  router.post('/', validateBody(organizationsPayloadSchema), addOrganization)
  router.get('/:id', validateParams(paramSchema), conditionalReadPerm, getOrganization)
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
