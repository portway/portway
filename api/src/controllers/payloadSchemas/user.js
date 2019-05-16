import Joi from 'joi'

export const rawSchema = {
  name: Joi.string(),
  email: Joi.string()
}

export default Joi.compile(rawSchema)