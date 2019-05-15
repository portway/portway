import Joi from 'joi'

import { validateBody } from '../libs/middleware/payloadValidation'
import signUpCoordinator from '../coordinators/signUp'
import userCoordinator from '../coordinators/user'
import auth from '../libs/auth/auth'

const signupPayloadSchema = Joi.compile({
  name: Joi.string().required(),
  email: Joi.string()
    .email()
    .required()
})

const initialPasswordPayloadSchema = Joi.compile({
  password: Joi.string().required()
})

const signupController = function(router) {
  // TODO: currently no auth on this route, whitelist to client server only?
  router.post('/', validateBody(signupPayloadSchema), signUp)
  router.post(
    '/initialPassword',
    auth.jwtPasswordResetMiddleware,
    validateBody(initialPasswordPayloadSchema),
    setInitialPassword
  )
}

const signUp = async function(req, res, next) {
  const { name, email } = req.body

  try {
    const token = await signUpCoordinator.createUserAndOrganization(name, email)
    res.status(200).send({ token })
  } catch (e) {
    next(e)
  }
}

const setInitialPassword = async function(req, res, next) {
  const { password } = req.body
  const { id: userId } = req.user

  try {
    await userCoordinator.setInitialPassword(userId, password)
  } catch (e) {
    next(e)
  }

  res.status(200).send()
}

export default signupController
