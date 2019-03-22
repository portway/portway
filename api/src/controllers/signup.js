import Joi from 'joi'

import validate from '../libs/payloadValidation'
import signUpCoordinator from '../coordinators/signUp'
import userCoordinator from '../coordinators/user'
import auth from '../libs/auth'

const signupPayloadSchema = Joi.compile({
  body: Joi.object().keys({
    firstName: Joi.string().required(),
    lastName: Joi.string().required(),
    email: Joi.string().email().required(),
    password: Joi.string().required()
  })
})

const signupController = function(router) {
  // TODO: currently no auth on this route
  router.post('/', validate(signupPayloadSchema), signUp)
  router.post('/initialPassword', auth.jwtPasswordResetMiddleware, setInitialPassword)
}

const signUp = async function(req, res) {
  const { firstName, lastName, email } = req.body

  try {
    const token = await signUpCoordinator.signUp(firstName, lastName, email)
    res.status(200).send({ token })
  } catch (e) {
    console.error(e.stack)
    res.status(e.code || 500).json({ error: 'Cannot sign up' })
  }
}

const setInitialPassword = async function(req, res) {
  const { userId, password } = req.body

  try {
    await userCoordinator.setInitialPassword(userId, password)
  } catch (e) {
    console.error(e.stack)
    res.status(e.code || 500).json({ error: 'Cannot sign up' })
  }
}

export default signupController
