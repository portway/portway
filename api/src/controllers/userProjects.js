import Joi from 'joi'
import { validateParams } from '../libs/middleware/payloadValidation'
import BusinessProject from '../businesstime/project'
import RESOURCE_TYPES from '../constants/resourceTypes'
import ACTIONS from '../constants/actions'
import perms from '../libs/middleware/reqPermissionsMiddleware'

const listPerm = (req, res, next) => {
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

  res.status(403).send('Invalid Permissions')
}

const paramSchema = Joi.compile({
  userId: Joi.number().required()
})

const userProjectsController = function(router) {
  // all routes are nested at users/:userId/projects and receive req.params.userId
  router.get(
    '/',
    validateParams(paramSchema),
    listPerm,
    getUserProjects
  )
}

const getUserProjects = async function(req, res) {
  const { userId } = req.params
  const { orgId } = req.requestorInfo

  try {
    const userProjects = await BusinessProject.findAllForUser(userId, orgId)
    res.status(200).json({ data: userProjects })
  } catch (e) {
    console.error(e.stack)
    res.status(e.code || 500).json({ error: 'Cannot fetch user projects' })
  }
}

export default userProjectsController