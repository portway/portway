import Joi from '@hapi/joi'
import { validateParams } from '../libs/middleware/payloadValidation'
import BusinessProjectUser from '../businesstime/projectuser'
import RESOURCE_TYPES from '../constants/resourceTypes'
import crudPerms from '../libs/middleware/reqCrudPerms'
import ACTIONS from '../constants/actions'
import perms from '../libs/middleware/reqPermissionsMiddleware'

const { readPerm } = crudPerms(
  RESOURCE_TYPES.USER,
  (req) => {
    return { id: req.params.id }
  }
)

const conditionalReadPerm = (req, res, next) => {
  const { userId } = req.params

  // only allow users to see their own project assignments for now
  if (userId === req.requestorInfo.requestorId) {
    return perms((req) => {
      return {
        resourceType: RESOURCE_TYPES.USER,
        action: ACTIONS.READ_MY
      }
    })(req, res, next)
  }
  // not requesting self, normal user assignments read perm
  return readPerm(req, res, next)
}

const paramSchema = Joi.compile({
  userId: Joi.number().required()
})

const userProjectAssignmentsController = function(router) {
  // all routes are nested at users/:userId/assignments and receive req.params.userId
  router.get(
    '/',
    validateParams(paramSchema),
    conditionalReadPerm,
    getUserProjectAssignments
  )
}

const getUserProjectAssignments = async function(req, res, next) {
  const { userId } = req.params
  const { orgId } = req.requestorInfo

  try {
    const userProjectAssignments = await BusinessProjectUser.findAllProjectAssignmentsForUser(userId, orgId)
    res.status(200).json({ data: userProjectAssignments })
  } catch (e) {
    next(e)
  }
}

export default userProjectAssignmentsController
