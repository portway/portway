import Joi from 'joi'

import { validateParams } from '../libs/middleware/payloadValidation'
import BusinessProject from '../businesstime/project'
import RESOURCE_TYPES from '../constants/resourceTypes'
import ACTIONS from '../constants/actions'
import perms from '../libs/middleware/reqPermissionsMiddleware'
import crudPerms from '../libs/middleware/reqCrudPerms'

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

const userProjectsController = function(router) {
  // all routes are nested at users/:userId/projects and receive req.params.userId
  router.get(
    '/',
    validateParams(paramSchema),
    conditionalListPerm,
    getUserProjects
  )
}

const getUserProjects = async function(req, res, next) {
  const { userId } = req.params
  const { orgId } = req.requestorInfo

  try {
    const userProjects = await BusinessProject.findAllForUser(userId, orgId)
    res.status(200).json({ data: userProjects })
  } catch (e) {
    next(e)
  }
}

export default userProjectsController