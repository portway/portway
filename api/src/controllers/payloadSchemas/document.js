import Joi from '@hapi/joi'

export const rawSchema = {
  name: Joi.string(),
  slug: Joi.string().min(1).max(140).regex(/^[a-z0-9-]+$/)
}

export default Joi.compile(rawSchema)
