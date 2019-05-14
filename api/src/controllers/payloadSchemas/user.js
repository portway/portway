import Joi from 'joi'

export const rawSchema = {
  firstName: Joi.string(),
  lastName: Joi.string(),
  email: Joi.string().email()
}

export default Joi.compile(rawSchema)