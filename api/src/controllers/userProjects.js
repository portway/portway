import Joi from 'joi'

import { validateParams, validateQuery } from '../libs/middleware/payloadValidation'
import BusinessProject from '../businesstime/project'
import RESOURCE_TYPES from '../constants/resourceTypes'
import ACTIONS from '../constants/actions'
import perms from '../libs/middleware/reqPermissionsMiddleware'
import crudPerms from '../libs/middleware/reqCrudPerms'
import { SORT_METHODS } from '../constants/queryOptions'

const { listPerm } = crudPerms(RESOURCE_TYPES.PROJECT,
  (req) => {
    return { id: req.params.id }
  }
)

const conditionalListPerm = (req, res, next) => {
  const { userId } = req.params

  // only allowing access to the current user's projects here
  if (userId === req.requestorInfo.requestorId) {
    return perms((req) => {
      return {
        resourceType: RESOURCE_TYPES.PROJECT,
        action: ACTIONS.LIST_MY
      }
    })(req, res, next)
  }

  // not requesting self, normal project list perm
  return listPerm(req, res, next)
}

const paramSchema = Joi.compile({
  userId: Joi.number().required()
})

const querySchema = Joi.compile({
  page: Joi.number(),
  perPage: Joi.number(),
  sortBy: Joi.string().valid(['name', 'updatedAt']),
  sortMethod: Joi.string().valid([SORT_METHODS.ASCENDING, SORT_METHODS.DESCENDING])
})

const userProjectsController = function(router) {
  // all routes are nested at users/:userId/projects and receive req.params.userId
  router.get(
    '/',
    validateParams(paramSchema),
    validateQuery(querySchema),
    conditionalListPerm,
    getUserProjects
  )
}

const getUserProjects = async function(req, res, next) {
  const { userId } = req.params
  const { orgId } = req.requestorInfo
  const { page = 1, perPage = 50, sortBy, sortMethod } = req.query
  const options = { page, perPage, sortBy, sortMethod }

  try {
    const { projects, count } = await BusinessProject.findAllForUser(userId, orgId, options)
    res.json({ data: projects, page, perPage, total: count, totalPages: Math.ceil(count / perPage) })
  } catch (e) {
    next(e)
  }
}

export default userProjectsController