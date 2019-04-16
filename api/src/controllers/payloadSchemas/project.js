import Joi from 'joi'

export const rawSchema = {
  name: Joi.string(),
  description: Joi.string().allow('').allow(null)
}

export default Joi.compile(rawSchema)
