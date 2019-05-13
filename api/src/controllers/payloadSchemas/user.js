import Joi from 'joi'

export const rawSchema = {
  firstName: Joi.string(),
  lastName: Joi.string(),
  email: Joi.string()
}

export default Joi.compile(rawSchema)