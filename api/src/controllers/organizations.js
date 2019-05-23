import Joi from 'joi'
import ono from 'ono'

import { validateBody, validateParams } from '../libs/middleware/payloadValidation'
import BusinessOrganization from '../businesstime/organization'
import perms from '../libs/middleware/reqPermissionsMiddleware'
import crudPerms from '../libs/middleware/reqCrudPerms'
import RESOURCE_TYPES from '../constants/resourceTypes'
import ACTIONS from '../constants/actions'
import { requiredFields } from './payloadSchemas/helpers'
import orgSchema from './payloadSchemas/user'

const paramSchema = Joi.compile({
  id: Joi.number().required()
})

const { createPerm, readPerm, updatePerm } = crudPerms(
  RESOURCE_TYPES.ORGANIZATION,
  (req) => { return { id: req.params.id } }
)

const conditionalReadPerm = (req, res, next) => {
  const { id } = req.params
  // if ids match use the 'READ_MY' organization perm
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

const conditionalUpdatePerm = async (req, res, next) => {
  const { id } = req.params
  // if ids match use the 'UPDATE_MY' organization perm
  if (id === req.requestorInfo.orgId) {
    return perms((req) => {
      return {
        resourceType: RESOURCE_TYPES.ORGANIZATION,
        action: ACTIONS.UPDATE_MY
      }
    })(req, res, next)
  }
  // not requesting self, normal organization read perm
  return updatePerm(req, res, next)
}

const organizationsController = function(router) {
  router.post('/', validateBody(requiredFields(RESOURCE_TYPES.ORGANIZATION), 'name'), createPerm, addOrganization)
  router.get('/:id', validateParams(paramSchema), conditionalReadPerm, getOrganization)
  router.put('/', validateBody(orgSchema), conditionalUpdatePerm, updateOrganization)
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
