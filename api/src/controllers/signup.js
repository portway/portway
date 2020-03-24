import Joi from '@hapi/joi'

import { validateBody } from '../libs/middleware/payloadValidation'
import signUpCoordinator from '../coordinators/signUp'
import userCoordinator from '../coordinators/user'
import auth from '../libs/auth/auth'
import passwordSchema from './payloadSchemas/password'

const signupPayloadSchema = Joi.compile({
  name: Joi.string().required(),
  email: Joi.string()
    .email()
    .required()
})

const signupController = function(router) {
  // TODO: currently no auth on this route, whitelist to client server only?
  router.post('/', validateBody(signupPayloadSchema), signUp)
  router.post(
    '/initialPassword',
    auth.jwtPasswordResetMiddleware,
    validateBody(passwordSchema),
    setInitialPassword
  )
}

const signUp = async function(req, res, next) {
  const { name, email } = req.body

  try {
    await signUpCoordinator.createUserAndOrganization(name, email)
    res.status(204).send()
  } catch (e) {
    next(e)
  }
}

const setInitialPassword = async function(req, res, next) {
  const { password } = req.body
  const { id: userId } = req.user

  try {
    const token = await userCoordinator.setInitialPassword(userId, password)
    res.json({ token })
  } catch (e) {
    next(e)
  }
}

export default signupController
