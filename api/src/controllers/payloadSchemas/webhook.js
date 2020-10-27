import Joi from '@hapi/joi'

export const rawSchema = {
  url: Joi.string().uri(),
  active: Joi.boolean().allow(null)
}

export default Joi.compile(rawSchema)