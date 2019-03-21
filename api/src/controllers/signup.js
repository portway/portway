import Joi from 'joi'
import validate from '../libs/payloadValidation'
import signUpCoordinator from '../coordinators/signUp'

const signupPayloadSchema = Joi.compile({
  body: Joi.object().keys({
    firstName: Joi.string().required(),
    lastName: Joi.string().required(),
    email: Joi.string().email().required(),
    password: Joi.string().required()
  })
})

const signupController = function(router) {
  router.post('/', validate(signupPayloadSchema), signUp)
}

const signUp = async function(req, res) {
  const { firstName, lastName, email, password } = req.body

  try {
    await signUpCoordinator.signUp(firstName, lastName, email, password)
    res.status(204).send()
  } catch (e) {
    console.error(e.stack)
    res.status(e.code || 500).json({ error: 'Cannot sign up' })
  }
}

export default signupController
