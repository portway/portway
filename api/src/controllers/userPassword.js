import Joi from 'joi'
import { validateBody, validateParams } from '../libs/middleware/payloadValidation'
import UserCoordinator from '../coordinators/user'
import RESOURCE_TYPES from '../constants/resourceTypes'
import ACTIONS from '../constants/actions'
import perms from '../libs/middleware/reqPermissionsMiddleware'
import auditLog, { auditActions } from '../integrators/audit'

const updatePerm = perms((req) => {
  return {
    resourceType: RESOURCE_TYPES.USER,
    action: ACTIONS.UPDATE_MY_PASSWORD
  }
})

const bodySchema = Joi.compile({
  currentPassword: Joi.string(),
  newPassword: Joi.string(),
  confirmNewPassword: Joi.string()
})

const paramSchema = Joi.compile({
  userId: Joi.number().required()
})

const userOrgRoleController = function(router) {
  // all routes are nested at users/:userId/orgrole and receive req.params.userId
  router.put(
    '/',
    updatePerm,
    validateParams(paramSchema),
    validateBody(bodySchema),
    updateUserPassword
  )
}

const updateUserPassword = async function(req, res, next) {
  const { currentPassword, newPassword, confirmNewPassword } = req.body
  const { userId } = req.params
  const { orgId } = req.requestorInfo

  try {
    await UserCoordinator.updatePassword(userId, currentPassword, newPassword, confirmNewPassword, orgId)
    res.status(204).json()
    auditLog({
      userId: req.requestorInfo.requestorId,
      primaryModel: RESOURCE_TYPES.PASSWORD,
      primaryId: null,
      secondaryModel: RESOURCE_TYPES.USER,
      secondaryId: userId,
      action: auditActions.UPDATED_PRIMARY_FOR_SECONDARY
    })
  } catch (e) {
    next(e)
  }
}

export default userOrgRoleController
