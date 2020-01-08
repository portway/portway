import auth from '../libs/auth/auth'
import tokenIntegrator from '../integrators/token'
import passwordResetCoordinator from '../coordinators/passwordReset'
import Joi from 'joi'
import { validateBody } from '../libs/middleware/payloadValidation'
import passwordPayloadSchema from './payloadSchemas/password'

const resetPasswordBodySchema = Joi.compile({
  email: Joi.string()
})

// Caution: login controller routes have NO AUTH by default!

const loginController = function(router) {
  router.post('/', auth.loginMiddleware, login)
  router.post(
    '/resetpassword',
    validateBody(resetPasswordBodySchema),
    resetPassword
  )
  router.post(
    '/newpassword',
    auth.jwtPasswordResetMiddleware,
    validateBody(passwordPayloadSchema),
    setPasswordFromReset
  )
}

const login = function(req, res) {
  const token = tokenIntegrator.generateToken(req.user.id, req.user.orgRoleId, req.user.orgId)
  res.json({
    token
  })
}

const resetPassword = function(req, res) {
  const { email } = req.body

  passwordResetCoordinator.initiatePasswordReset(email)

  res.status(204).send()
}

const setPasswordFromReset = async function(req, res, next) {
  const { password } = req.body
  const { id: userId } = req.user

  try {
    const token = await passwordResetCoordinator.setNewPassword(userId, password)
    res.json({ token })
  } catch (e) {
    next(e)
  }
}

export default loginController
