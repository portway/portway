import Joi from 'joi'
import { validateBody, validateParams } from '../libs/middleware/payloadValidation'
import BusinessUser from '../businesstime/projectuser'

const bodySchema = Joi.compile({
  orgRoleId: Joi.number().required()
})

const paramSchema = Joi.compile({
  userId: Joi.number().required()
})

const userOrgRoleController = function(router) {
  // all routes are nested at users/:userId/orgrole and receive req.params.userId
  // TODO: no perm check on this route currently
  router.put(
    '/',
    validateParams(paramSchema),
    validateBody(bodySchema),
    updateUserOrgrole
  )
}

const updateUserOrgrole = async function(req, res) {
  const { orgRoleId } = req.body
  const { userId } = req.params
  const { orgId } = req.requestorInfo

  try {
    BusinessUser.updateOrgRole(userId, orgRoleId, orgId)
    res.status(204).json()
  } catch (e) {
    console.error(e.stack)
    res.status(e.code || 500).json({ error: 'Cannot update user organization role' })
  }
}

export default userOrgRoleController
