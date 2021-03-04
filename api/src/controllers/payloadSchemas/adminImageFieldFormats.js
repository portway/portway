import Joi from '@hapi/joi'

export const rawSchema = {
  webp: Joi.object({
    half: Joi.string(),
    full: Joi.string()
  }),
  original: Joi.object({
    half: Joi.string(),
    full: Joi.string()
  })
}

export default Joi.compile(rawSchema)
