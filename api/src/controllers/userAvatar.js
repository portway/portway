import Joi from 'joi'
import multer from 'multer'

import { validateBody, validateParams } from '../libs/middleware/payloadValidation'
import crudPerms from '../libs/middleware/reqCrudPerms'
import RESOURCE_TYPES from '../constants/resourceTypes'
import perms from '../libs/middleware/reqPermissionsMiddleware'
import ACTIONS from '../constants/actions'
import avatarCoordinator from '../coordinators/avatar'

const MAX_AVATAR_FILE_SIZE = 1024 * 1000

const paramSchema = Joi.compile({
  id: Joi.number().required()
})

const { updatePerm } = crudPerms(RESOURCE_TYPES.USER, (req) => {
  return { id: req.params.id }
})

const conditionalUpdatePerm = (req, res, next) => {
  const { id } = req.params
  // if ids match use the 'UPDATE_MY' user perm
  if (id === req.requestorInfo.requestorId) {
    return perms((req) => {
      return {
        resourceType: RESOURCE_TYPES.USER,
        action: ACTIONS.UPDATE_MY
      }
    })(req, res, next)
  }
  // not requesting self, normal user update perm
  return updatePerm(req, res, next)
}

const usersController = function(router) {
  router.put(
    '/',
    validateParams(paramSchema),
    multer({
      dest: 'uploads/',
      limits: {
        fileSize: MAX_AVATAR_FILE_SIZE
      }
    }).single('file'),
    validateBody({}),
    conditionalUpdatePerm,
    updateUserAvatar
  )
}

const updateUserAvatar = async function(req, res, next) {
  const { id } = req.params
  const { file } = req
  const { orgId } = req.requestorInfo

  try {
    const avatar = await avatarCoordinator.updateUserAvatar(orgId, id, file)
    res.status(200).json({ data: { avatar } })
  } catch (e) {
    next(e)
  }
}

export default usersController
