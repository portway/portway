import Joi from 'joi'
import { validateParams } from '../libs/middleware/payloadValidation'
import BusinessProjectUser from '../businesstime/projectuser'
import RESOURCE_TYPES from '../constants/resourceTypes'
import ACTIONS from '../constants/actions'
import perms from '../libs/middleware/reqPermissionsMiddleware'
import ERROR_MESSAGES from '../constants/errorMessages'

const readPerm = (req, res, next) => {
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

  res.status(404).send({ error: ERROR_MESSAGES.NOT_FOUND })
}

const paramSchema = Joi.compile({
  userId: Joi.number().required()
})

const userProjectRolesController = function(router) {
  // all routes are nested at users/:userId/assignments and receive req.params.userId
  router.get(
    '/',
    validateParams(paramSchema),
    readPerm,
    getUserProjectAssignments
  )
}

const getUserProjectAssignments = async function(req, res) {
  const { userId } = req.params
  const { orgId } = req.requestorInfo

  try {
    const userProjectAssignments = await BusinessProjectUser.findAllProjectAssignmentsForUser(userId, orgId)
    res.status(200).json({ data: userProjectAssignments })
  } catch (e) {
    console.error(e.stack)
    res.status(e.code || 500).json({ error: 'Cannot fetch user project assignments' })
  }
}

export default userProjectRolesController