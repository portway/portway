import Joi from '@hapi/joi'

export const rawSchema = {
  webp: Joi.object({
    half: Joi.string().uri(),
    full: Joi.string().uri(),
    mimeType: Joi.string()
  }),
  original: Joi.object({
    half: Joi.string().uri(),
    full: Joi.string().uri(),
    mimeType: Joi.string()
  })
}

export default Joi.compile(rawSchema)
